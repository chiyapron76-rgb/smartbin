import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // 1. ดึงรายงานปัญหา (เจ้าหน้าที่)
  @Get('issues')
  getIssues() {
    return this.reportsService.getAllIssues();
  }

  // 2. อัปเดตสถานะปัญหา (เจ้าหน้าที่)
  @Patch('issues/:id/status')
  updateIssueStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.reportsService.updateIssueStatus(id, status);
  }

  // 3. ดึงรายงาน (ประชาชน)
  @Get('citizen')
  getCitizenReports() {
    return this.reportsService.getAllCitizenReports();
  }

  // 4. อัปเดตสถานะ (ประชาชน)
  @Patch('citizen/:id/status')
  updateCitizenStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.reportsService.updateCitizenStatus(id, status);
  }
}