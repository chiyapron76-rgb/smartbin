import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBinDto } from "./dto/create-bin.dto";
import { UpdateBinDto } from "./dto/update-bin.dto";

@Injectable()
export class BinService {
  constructor(private prisma: PrismaService) {}

  private async generateBinCode(): Promise<string> {
    const lastBin = await this.prisma.bin.findFirst({
      orderBy: { bin_code: "desc" },
    });

    if (!lastBin) return "BIN-001";

    const lastNumber = parseInt(lastBin.bin_code.replace("BIN-", ""), 10);
    return `BIN-${String(lastNumber + 1).padStart(3, "0")}`;
  }

  private mapStatusToIcon(status: string) {
    switch (status) {
      case "active":
        return "green-check";
      case "offline":
        return "red-error";
      case "inactive":
      default:
        return "yellow-default";
    }
  }

  async create(data: CreateBinDto) {
    const lat = Number(data.latitude);
    const lng = Number(data.longitude);
    if (isNaN(lat) || isNaN(lng))
      throw new BadRequestException("Invalid coordinates");

    const binCode = await this.generateBinCode();

    const smartbin = await this.prisma.smartBin.create({
      data: {
        bin_code: binCode,
        sensor_type: "mock",
        install_date: new Date(),
        location_lat: lat,
        location_lng: lng,
        address_note: data.address_note,
        zone: data.zone,
        status: "inactive",
      },
    });

    await this.prisma.bin.create({
      data: {
        bin_code: binCode,
        device_id: smartbin.id,
        name: binCode,
        area: data.zone,
        capacity: 60,
        latitude: lat,
        longitude: lng,
        installed_at: new Date(),
        description: data.address_note,
        status: "normal",
      },
    });

    return { message: "Bin created successfully", bin_code: binCode };
  }

  async getAll() {
    return this.prisma.smartBin.findMany({
      include: {
        sensorRecords: { orderBy: { timestamp: "desc" }, take: 1 },
        alerts: { orderBy: { created_at: "desc" }, take: 3 },
        bins: true,
      },
      orderBy: { bin_code: 'asc' } // เรียงตามรหัส
    });
  }

  async getPublicBins() {
    const smartbins = await this.prisma.smartBin.findMany({
      include: {
        bins: true, 
        sensorRecords: { orderBy: { timestamp: "desc" }, take: 1 },
      },
    });

    return smartbins
      .filter((sb) => sb.bins && sb.bins.length > 0) 
      .map((sb) => {
        const lastSensor = sb.sensorRecords?.[0];
        const fillLevel = lastSensor ? lastSensor.fill_percentage : 0;

        return {
          id: sb.bins[0].id,
          smartbins_id: sb.id,    
          code: sb.bin_code,
          zone: sb.zone,
          address_note: sb.address_note ?? sb.bins[0]?.description ?? null,
          lat: sb.location_lat,
          lng: sb.location_lng,
          status: sb.status,
          fill_level: fillLevel, 
          icon: this.mapStatusToIcon(sb.status),
        };
      });
  }

  // 🟢 แก้ไขฟังก์ชันนี้: ให้ดึงข้อมูลพร้อมแปลง format สำหรับหน้าแก้ไข
  async getSmartBinById(id: string) {
    const bin = await this.prisma.smartBin.findUnique({ 
      where: { id },
      include: { bins: true } // ดึง bins เพื่อเอา description
    });
    
    if (!bin) throw new NotFoundException("Bin not found");

    return {
      ...bin,
      // Map ค่าให้ตรงกับที่หน้าบ้าน (Form) ต้องการ
      latitude: bin.location_lat,
      longitude: bin.location_lng,
      description: bin.bins?.[0]?.description || "" 
    };
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

  // 🟢 แก้ไขฟังก์ชัน Update ให้ถูกต้อง
  async updateBin(id: string, data: UpdateBinDto | any) {
    // 1. อัปเดต SmartBin
    const updated = await this.prisma.smartBin.update({
      where: { id },
      data: {
        zone: data.zone ?? undefined,
        address_note: data.address_note ?? data.note ?? undefined,
        location_lat: data.latitude ? Number(data.latitude) : undefined,
        location_lng: data.longitude ? Number(data.longitude) : undefined,
        status: (data.status as any) ?? undefined,
      },
    });

    // 2. อัปเดตข้อมูลในตาราง Bin ด้วย (เพื่อให้ชื่อสถานที่ตรงกัน)
    await this.prisma.bin.updateMany({
      where: { device_id: id },
      data: {
        area: data.zone ?? undefined,
        description: data.description ?? data.address_note ?? undefined, // ใช้ description จากหน้าบ้าน
        latitude: data.latitude ? Number(data.latitude) : undefined,
        longitude: data.longitude ? Number(data.longitude) : undefined,
      },
    });

    return updated;
  }

  async deleteBin(id: string) {
    try {
      const bin = await this.prisma.bin.findFirst({
        where: { device_id: id },
      });

      const binId = bin?.id ?? null;

      if (binId) {
        await this.prisma.issueReport.deleteMany({ where: { bin_id: binId } });
        await this.prisma.citizenReport.deleteMany({ where: { bin_id: binId } });
        await this.prisma.taskItem.deleteMany({ where: { bin_id: binId } });
      }

      await this.prisma.bin.deleteMany({ where: { device_id: id } });
      await this.prisma.alert.deleteMany({ where: { binId: id } });
      await this.prisma.sensorRecord.deleteMany({ where: { binId: id } });

      return this.prisma.smartBin.delete({ where: { id } });
    } catch (err) {
      console.error("DELETE ERROR:", err);
      throw err;
    }
  }
}