import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBinDto } from "./dto/create-bin.dto";

@Injectable()
export class BinService {
  constructor(private prisma: PrismaService) {}

  /**
   * โค้ด — GEN BIN-001, BIN-002 เป็นต้น
   */
  private async generateBinCode(): Promise<string> {
    const lastBin = await this.prisma.bin.findFirst({
      orderBy: { bin_code: "desc" },
    });

    if (!lastBin) return "BIN-001";

    const lastNumber = parseInt(lastBin.bin_code.replace("BIN-", ""), 10);
    const nextNumber = lastNumber + 1;

    return `BIN-${String(nextNumber).padStart(3, "0")}`;
  }

  /**
   * Create SmartBin + Bin (จับคู่กัน)
   */
  async create(data: CreateBinDto) {
    // 1) Generate bin_code หาก user ไม่ส่งมา
    const binCode = data.bin_code ?? (await this.generateBinCode());

    // 2) Check duplicate on SmartBin or Bin
    const exists1 = await this.prisma.smartBin.findUnique({
      where: { bin_code: binCode },
    });

    const exists2 = await this.prisma.bin.findUnique({
      where: { bin_code: binCode },
    });

    if (exists1 || exists2) {
      throw new BadRequestException("bin_code already exists");
    }

    // 3) Create SmartBin device
    const device = await this.prisma.smartBin.create({
      data: {
        bin_code: binCode,
        sensor_type: "simulate",
        install_date: new Date(),
        last_heartbeat: null,
        firmware_version: null,
        network_type: null,
        is_online: false,
        location_lat: data.latitude ?? null,
        location_lng: data.longitude ?? null,
        address_note: data.address_note ?? null,
        zone: data.zone ?? null,
        status: "active",
      },
    });

    // 4) Create Bin
    const bin = await this.prisma.bin.create({
      data: {
        bin_code: binCode,
        device_id: device.id,
        name: `${binCode}`,
        area: data.zone ?? "Unspecified",
        capacity: 60,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        installed_at: new Date(),
        description: data.address_note ?? null,
        status: "normal",
      },
    });

    return {
      message: "Bin created successfully",
      bin_code: binCode,
      device,
      bin,
    };
  }

  async getAll() {
    return this.prisma.smartBin.findMany({
      include: {
        sensorRecords: { orderBy: { timestamp: "desc" }, take: 1 },
        alerts: { orderBy: { created_at: "desc" }, take: 3 },
        bins: true,
      },
    });
  }

  async getByCode(code: string) {
    return this.prisma.bin.findUnique({
      where: { bin_code: code },
      include: {
        device: {
          include: {
            sensorRecords: { orderBy: { timestamp: "desc" }, take: 10 },
            alerts: { orderBy: { created_at: "desc" }, take: 5 },
          },
        },
      },
    });
  }
}
