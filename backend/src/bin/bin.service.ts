import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BinService {
  constructor(private prisma: PrismaService) {}

  // ดึงทุก SmartBin พร้อม sensorRecords ล่าสุด + alerts ล่าสุด 3 รายการ
  async getAll() {
    return this.prisma.smartBin.findMany({
      include: {
        sensorRecords: {
          orderBy: { timestamp: "desc" }, // schema: timestamp
          take: 1,
        },
        alerts: {
          orderBy: { created_at: "desc" }, // schema: created_at
          take: 3,
        },
      },
    });
  }

  // ดึง SmartBin โดย bin_code
  async getByCode(code: string) {
    return this.prisma.smartBin.findUnique({
      where: { bin_code: code },
      include: {
        sensorRecords: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
        alerts: {
          orderBy: { created_at: "desc" },
          take: 5,
        },
      },
    });
  }

  async getById(id: string) {
    return this.prisma.smartBin.findUnique({
      where: { id },
      include: {
        sensorRecords: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
        alerts: {
          orderBy: { created_at: "desc" },
          take: 5,
        },
      },
    });
  }
}
