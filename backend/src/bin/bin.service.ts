import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BinService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.smartBin.findMany({
      include: {
        sensorRecords: { orderBy: { timestamp: 'desc' }, take: 1 },
        alerts: { orderBy: { createdAt: 'desc' }, take: 3 },
      },
    });
  }

  async getByCode(code: string) {
    return this.prisma.smartBin.findUnique({
      where: { bin_code: code },
      include: {
        sensorRecords: { orderBy: { timestamp: 'desc' }, take: 1 },
        alerts: { orderBy: { createdAt: 'desc' }, take: 3 },
      },
    });
  }
}
