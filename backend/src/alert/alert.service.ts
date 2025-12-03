import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AlertService {
  constructor(private prisma: PrismaService) {}

  // ดึง alert ทั้งหมด (ใหม่สุดก่อน)
  async getAll() {
  return this.prisma.alert.findMany({
    orderBy: { created_at: "desc" },
  });
}

async getByBinId(binId: string) {
  return this.prisma.alert.findMany({
    where: { binId },
    orderBy: { created_at: "desc" },
  });
}
  // สร้าง alert ใหม่ (ถ้าต้องการ service-level helper)
  async create(binId: string, alert_type: string, message: string, severity?: string) {
    return this.prisma.alert.create({
      data: {
        binId,
        alert_type: alert_type as any,
        message,
        severity: severity as any,
      },
    });
  }
}
