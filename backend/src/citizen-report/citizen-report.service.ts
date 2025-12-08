import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCitizenReportDto } from "./dto/create-citizen-report.dto";
import { UpdateCitizenReportStatusDto } from "./dto/update-status.dto";

@Injectable()
export class CitizenReportService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCitizenReportDto) {
    // 1) ตรวจว่ามี bin จริงไหม
    const bin = await this.prisma.bin.findUnique({
      where: { id: dto.bin_id },
    });

    if (!bin) {
      throw new BadRequestException("Invalid bin_id: this bin does not exist");
    }

    // 2) สร้าง Citizen Report
    return this.prisma.citizenReport.create({
      data: {
        bin_id: dto.bin_id,
        issue_type: dto.issue_type,
        description: dto.description,
        device_uuid: dto.device_uuid,
        location_lat: dto.location_lat,
        location_lng: dto.location_lng,
      },
    });
  }

  async getAll(device_uuid?: string) {
    return this.prisma.citizenReport.findMany({
      where: device_uuid ? { device_uuid } : {},
      include: { bin: true },
      orderBy: { created_at: "desc" },
    });
  }

  async updateStatus(id: string, dto: UpdateCitizenReportStatusDto) {
    const found = await this.prisma.citizenReport.findUnique({ where: { id } });
    if (!found) throw new NotFoundException("Report not found");

    return this.prisma.citizenReport.update({
      where: { id },
      data: {
        status: dto.status,
        resolved_at: dto.status === "resolved" ? new Date() : null,
      },
    });
  }
}
