import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AlertService {
  constructor(private prisma: PrismaService) {}

  async getAllAlerts() {
    return this.prisma.alert.findMany({
      orderBy: { createdAt: "desc" },
      include: { bin: true },
    });
  }

  async getAlertsByBin(binId: string) {
    return this.prisma.alert.findMany({
      where: { binId },
      orderBy: { createdAt: "desc" },
    });
  }
}
