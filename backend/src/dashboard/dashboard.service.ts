// backend/src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  /** existing summary (compatible with your original) */
  async getSummary() {
    const bins = await this.prisma.smartBin.findMany({
      include: { sensorRecords: { orderBy: { timestamp: 'desc' }, take: 1 } },
    });

    const total_bins = bins.length;
    const counts_by_device_status = { active: 0, inactive: 0, maintenance: 0, offline: 0 };

    let fillSum = 0;
    let fillCount = 0;
    let battSum = 0;
    let battCount = 0;

    for (const b of bins) {
      const status = (b.status ?? 'active') as string;
      if ((counts_by_device_status as any)[status] !== undefined) {
        (counts_by_device_status as any)[status] += 1;
      } else {
        counts_by_device_status.inactive += 1;
      }

      const rec = b.sensorRecords && b.sensorRecords.length > 0 ? b.sensorRecords[0] : null;
      if (rec) {
        const fill = Number(rec.fill_percentage ?? NaN);
        const batt = Number(rec.battery_voltage ?? NaN);

        if (!Number.isNaN(fill)) {
          fillSum += fill;
          fillCount += 1;
        }
        if (!Number.isNaN(batt)) {
          battSum += batt;
          battCount += 1;
        }
      }
    }

    const avg_fill = fillCount > 0 ? +(fillSum / fillCount).toFixed(2) : null;
    const avg_battery = battCount > 0 ? +(battSum / battCount).toFixed(2) : null;

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const alerts_today = await this.prisma.alert.count({
      where: { created_at: { gte: startOfDay } },
    });

    return {
      total_bins,
      counts_by_device_status,
      avg_fill,
      avg_battery,
      alerts_today,
    };
  }

  /** zone-level aggregation (group by SmartBin.zone) */
  async getZoneStats() {
    const bins = await this.prisma.smartBin.findMany({
      include: {
        sensorRecords: { orderBy: { timestamp: 'desc' }, take: 1 },
        // include alerts (we only need to inspect alert_type === 'full' later)
        alerts: { orderBy: { created_at: 'desc' }, take: 10 },
        // Also include related Bin[] if you want to count actual Bin.status 'full'
        bins: { select: { id: true, status: true } },
      },
    });

    const map: Record<
      string,
      { bins: number; fillSum: number; fillCount: number; full_count: number }
    > = {};

    for (const b of bins) {
      const z = b.zone ?? 'Unknown';
      if (!map[z]) map[z] = { bins: 0, fillSum: 0, fillCount: 0, full_count: 0 };
      map[z].bins += 1;

      const rec = b.sensorRecords && b.sensorRecords.length > 0 ? b.sensorRecords[0] : null;
      if (rec && typeof rec.fill_percentage === 'number') {
        map[z].fillSum += rec.fill_percentage;
        map[z].fillCount += 1;
      }

      // Count 'full' from alerts with alert_type === 'full'
      if (b.alerts && b.alerts.length > 0) {
        map[z].full_count += b.alerts.filter((a) => a.alert_type === 'full').length;
      }
      // Optionally also count Bin.status === 'full' from related Bin[] (if set)
      if (b.bins && b.bins.length > 0) {
        map[z].full_count += b.bins.filter((bn: any) => bn.status === 'full').length;
      }
    }

    return Object.entries(map).map(([zone, v]) => ({
      zone,
      bins: v.bins,
      avg_fill: v.fillCount ? +(v.fillSum / v.fillCount).toFixed(2) : null,
      full_count: v.full_count,
    }));
  }

  /** trends: average fill per day + alerts per day for last `days` */
  async getTrends(days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - (days - 1));
    since.setHours(0, 0, 0, 0);

    const recs = await this.prisma.sensorRecord.findMany({
      where: { timestamp: { gte: since } },
      select: { timestamp: true, fill_percentage: true },
    });

    const alerts = await this.prisma.alert.findMany({
      where: { created_at: { gte: since } },
      select: { created_at: true },
    });

    const fillMap: Record<string, { sum: number; count: number }> = {};
    for (const r of recs) {
      const d = new Date(r.timestamp).toISOString().slice(0, 10);
      if (!fillMap[d]) fillMap[d] = { sum: 0, count: 0 };
      if (typeof r.fill_percentage === 'number') {
        fillMap[d].sum += r.fill_percentage;
        fillMap[d].count += 1;
      }
    }

    const alertMap: Record<string, number> = {};
    for (const a of alerts) {
      const d = new Date(a.created_at).toISOString().slice(0, 10);
      alertMap[d] = (alertMap[d] ?? 0) + 1;
    }

    const series: Array<{ date: string; avg_fill: number | null; alerts: number }> = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const f = fillMap[key];
      series.push({
        date: key,
        avg_fill: f && f.count > 0 ? +(f.sum / f.count).toFixed(2) : null,
        alerts: alertMap[key] ?? 0,
      });
    }
    return series;
  }

  /** device health: use SmartBin model (no separate smartBinDevice in your schema) */
  async getDeviceHealth() {
    const devices = await this.prisma.smartBin.findMany({
      select: {
        id: true,
        firmware_version: true,
        network_type: true,
        is_online: true,
        last_heartbeat: true,
      },
    });

    const total = devices.length;
    const online = devices.filter((d) => d.is_online).length;
    const offline = total - online;
    const firmware: Record<string, number> = {};
    const network: Record<string, number> = {};
    for (const d of devices) {
      firmware[d.firmware_version ?? 'unknown'] = (firmware[d.firmware_version ?? 'unknown'] ?? 0) + 1;
      network[d.network_type ?? 'unknown'] = (network[d.network_type ?? 'unknown'] ?? 0) + 1;
    }

    return { total, online, offline, firmware, network, devices_sample: devices.slice(0, 20) };
  }

  /** recent alerts (include related SmartBin via 'bin' relation in schema) */
  async getRecentAlerts(limit = 20) {
    return this.prisma.alert.findMany({
      orderBy: { created_at: 'desc' },
      take: limit,
      include: { bin: { select: { id: true, bin_code: true, zone: true } } },
    });
  }

  /** tasks summary (today) */
  async getTasksSummary() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const totalToday = await this.prisma.task.count({
      where: { created_at: { gte: start, lt: end } },
    });
    const completed = await this.prisma.task.count({
      where: { created_at: { gte: start, lt: end }, status: 'completed' },
    });
    const inProgress = await this.prisma.task.count({
      where: { created_at: { gte: start, lt: end }, status: 'in_progress' },
    });

    return {
      totalToday,
      completed,
      inProgress,
      completionRate: totalToday > 0 ? +((completed / totalToday) * 100).toFixed(1) : 0,
    };
  }

  /** citizen reports summary */
  async getCitizenReportsSummary() {
    const open = await this.prisma.citizenReport.count({ where: { status: 'open' } });
    const inProgress = await this.prisma.citizenReport.count({ where: { status: 'in_progress' } });
    const resolved = await this.prisma.citizenReport.count({ where: { status: 'resolved' } });
    return { open, inProgress, resolved };
  }
}
