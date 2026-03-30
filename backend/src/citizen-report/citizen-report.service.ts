import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCitizenReportDto } from "./dto/create-citizen-report.dto";
import { CitizenReportStatus, RatingPlatform } from "@prisma/client";

@Injectable()
export class CitizenReportService {
  constructor(private prisma: PrismaService) {}

  // 1. สร้างรายงาน
  async create(dto: CreateCitizenReportDto) {
    return this.prisma.citizenReport.create({
      data: {
        bin_id: dto.bin_id,
        issue_type: dto.issue_type,
        description: dto.description,
        device_uuid: dto.device_uuid,
        location_lat: dto.location_lat,
        location_lng: dto.location_lng,
        status: CitizenReportStatus.open,
      },
    });
  }

  // 2. ดึงข้อมูล
  async getAll(device_uuid?: string) {
    return this.prisma.citizenReport.findMany({
      where: device_uuid ? { device_uuid } : {},
      include: { bin: true },
      orderBy: { created_at: "desc" },
    });
  }

  // 3. อัปเดตสถานะ
  async updateStatus(id: string, status: CitizenReportStatus) {
    const found = await this.prisma.citizenReport.findUnique({ where: { id } });
    if (!found) throw new NotFoundException("ไม่พบข้อมูลรายงาน");

    return this.prisma.citizenReport.update({
      where: { id },
      data: { 
        status,
        resolved_at: status === CitizenReportStatus.resolved ? new Date() : null,
      },
    });
  }

  // 4. ลบรายงาน
  async remove(id: string) {
    const found = await this.prisma.citizenReport.findUnique({ where: { id } });
    if (!found) throw new NotFoundException("ไม่พบรายงานที่ต้องการลบ");

    return this.prisma.citizenReport.delete({
      where: { id },
    });
  }

  // 🟢 5. บันทึกการประเมิน (แก้ไขให้ถูกต้อง)
  async submitRating(reportId: string, dto: { rating: number; comment?: string; device_uuid: string }) {
    // 1. ตรวจสอบว่ามีรายงานนี้จริงไหม
    const report = await this.prisma.citizenReport.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException("ไม่พบรายงาน");

    // 2. บันทึกคะแนนลงใน CitizenReport โดยตรง (ตาม Schema ที่เราเตรียมไว้)
    return this.prisma.citizenReport.update({
      where: { id: reportId },
      data: {
        // 🔴 ของเดิม: is_rated: true (ผิด! เพราะไม่มีช่องนี้ใน DB)
        // 🟢 ของใหม่: ใส่ให้ตรงกับ schema.prisma
        rating: Number(dto.rating), 
        feedback: dto.comment
      }
    });
  }
}