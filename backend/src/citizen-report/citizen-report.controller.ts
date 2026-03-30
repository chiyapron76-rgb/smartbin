import { Controller, Post, Get, Patch, Body, Param, Query, Delete } from "@nestjs/common";
import { CitizenReportService } from "./citizen-report.service";
import { CreateCitizenReportDto } from "./dto/create-citizen-report.dto";
import { UpdateCitizenReportStatusDto } from "./dto/update-status.dto";

@Controller("citizen-reports")
export class CitizenReportController {
  constructor(private readonly service: CitizenReportService) {}

  @Post()
  create(@Body() dto: CreateCitizenReportDto) {
    return this.service.create(dto);
  }

  @Get()
  getAll(@Query("device_uuid") device_uuid?: string) {
    return this.service.getAll(device_uuid);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateCitizenReportStatusDto
  ) {
    return this.service.updateStatus(id, dto.status);
  }

  @Delete(":id") 
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }

  // 🟢 Endpoint สำหรับรับค่าประเมิน
  @Post(":id/rate")
  submitRating(
    @Param("id") id: string,
    @Body() dto: { rating: number; comment?: string; device_uuid: string }
  ) {
    return this.service.submitRating(id, dto);
  }
}