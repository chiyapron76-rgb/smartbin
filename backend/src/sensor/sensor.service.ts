import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SensorService {
  constructor(private prisma: PrismaService) {}

  async createRecord(data: any) {
    if (!data.bin_code || typeof data.distance_cm !== 'number') {
      throw new Error('invalid payload');
    }

    let bin = await this.prisma.smartBin.findUnique({ where: { bin_code: data.bin_code }});
    if (!bin) {
      bin = await this.prisma.smartBin.create({
        data: {
          bin_code: data.bin_code,
          sensor_type: data.sensor_type || 'mock',
          location_lat: data.location_lat,
          location_lng: data.location_lng
        }
      });
    }

    // update last heartbeat
    await this.prisma.smartBin.update({
      where: { id: bin.id },
      data: { last_heartbeat: new Date(), is_online: true }
    });

    const record = await this.prisma.sensorRecord.create({
      data: {
        binId: bin.id,
        distance_cm: data.distance_cm,
        fill_percentage: data.fill_percentage ?? 0,
        battery_voltage: data.battery_voltage ?? null,
        temperature: data.temperature ?? null,
        raw_value: data.raw_value ?? null
      }
    });

    return record;
  }

  async getRecentRecords(bin_code: string) {
    const bin = await this.prisma.smartBin.findUnique({ where: { bin_code }});
    if (!bin) return [];
    return this.prisma.sensorRecord.findMany({
      where: { binId: bin.id },
      orderBy: { timestamp: 'desc' },
      take: 50
    });
  }

  async getBinsOverview() {
    return this.prisma.smartBin.findMany({
      include: {
        sensorRecords: { orderBy: { timestamp: 'desc' }, take: 1 }
      }
    });
  }
}
