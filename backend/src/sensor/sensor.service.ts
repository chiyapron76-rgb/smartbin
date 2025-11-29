import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SensorService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------
  // SAFE ALERT CHECK
  // --------------------------------------------
  private async checkAlerts(binId: string, data: any) {
    const alerts: any[] = [];

    const fill = Number(data.fill_percentage ?? 0);
    const battery = data.battery_voltage;

    // 1) ถังเต็ม (safe)
    if (!isNaN(fill) && fill >= 80) {
      alerts.push({
        alert_type: "bin_full",
        message: `Bin is ${fill}% full`,
      });
    }

    // 2) แบตต่ำ (safe)
    if (battery !== null && battery !== undefined && !isNaN(battery)) {
      if (battery < 3.3) {
        alerts.push({
          alert_type: "battery_low",
          message: `Battery low: ${battery.toFixed(2)}V`,
        });
      }
    }

    // กลัว undefined มาก — ไม่ save อะไรถ้าค่าวุ้นๆ
    for (const a of alerts) {
      await this.prisma.alert.create({
        data: {
          binId,
          alert_type: a.alert_type,
          message: a.message,
        },
      });
    }

    return alerts;
  }

  // --------------------------------------------
  // CREATE RECORD
  // --------------------------------------------
  async createRecord(data: any) {
    if (!data.bin_code || typeof data.distance_cm !== 'number') {
      throw new Error('invalid payload');
    }

    // find or create bin
    let bin = await this.prisma.smartBin.findUnique({
      where: { bin_code: data.bin_code },
    });

    if (!bin) {
      bin = await this.prisma.smartBin.create({
        data: {
          bin_code: data.bin_code,
          sensor_type: data.sensor_type || 'mock',
          location_lat: data.location_lat ?? null,
          location_lng: data.location_lng ?? null,
        },
      });
    }

    // update last heartbeat
    await this.prisma.smartBin.update({
      where: { id: bin.id },
      data: { last_heartbeat: new Date(), is_online: true },
    });

    // SAVE RECORD (safe defaults)
    const record = await this.prisma.sensorRecord.create({
      data: {
        binId: bin.id,
        distance_cm: Number(data.distance_cm),
        fill_percentage: Number(data.fill_percentage ?? 0),
        battery_voltage: data.battery_voltage ?? null,
        temperature: data.temperature ?? null,
        raw_value: data.raw_value ?? null,
      },
    });

    // ตรวจ alert หลังเซฟ
    await this.checkAlerts(bin.id, data);

    return record;
  }

  // --------------------------------------------
  async getRecentRecords(bin_code: string) {
    const bin = await this.prisma.smartBin.findUnique({ where: { bin_code } });
    if (!bin) return [];

    return this.prisma.sensorRecord.findMany({
      where: { binId: bin.id },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
  }

  async getBinsOverview() {
    return this.prisma.smartBin.findMany({
      include: {
        sensorRecords: { orderBy: { timestamp: 'desc' }, take: 1 },
      },
    });
  }
}
