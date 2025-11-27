import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BinService {
  constructor(private prisma: PrismaService) {}

  async getAllBins() {
    return this.prisma.smartBin.findMany({
      include: {
        sensorRecords: { orderBy: { timestamp: 'desc' }, take: 1 }
      }
    });
  }

  async getBinByCode(bin_code: string) {
    return this.prisma.smartBin.findUnique({
      where: { bin_code },
      include: {
        sensorRecords: { orderBy: { timestamp: 'desc' }, take: 50 }
      }
    });
  }
}
