import { Controller, Post, Get, Patch, Body, Param, Query } from "@nestjs/common";
import { CitizenReportService } from "./citizen-report.service";
import { CreateCitizenReportDto } from "./dto/create-citizen-report.dto";
import { UpdateCitizenReportStatusDto } from "./dto/update-status.dto";

@Controller("citizen-reports")
export class CitizenReportController {
  constructor(private service: CitizenReportService) {}

  // Citizen ส่งเรื่อง
  @Post()
  create(@Body() dto: CreateCitizenReportDto) {
    return this.service.create(dto);
  }

  // Admin: GET /citizen-reports
  // Citizen: GET /citizen-reports?device_uuid=xxx
  @Get()
  getAll(@Query("device_uuid") device_uuid?: string) {
    return this.service.getAll(device_uuid);
  }

  // Admin อัปเดตสถานะ citizen report
  @Patch(":id/status")
  changeStatus(
    @Param("id") id: string,
    @Body() dto: UpdateCitizenReportStatusDto
  ) {
    return this.service.updateStatus(id, dto); // <<<<<< ต้องส่งทั้ง object
  }
}
