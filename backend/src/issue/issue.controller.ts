import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { IssueService } from './issue.service';

@Controller('reports')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @Get('issues')
  getAll() {
    return this.issueService.getAll();
  }

  // 🟢 1. เพิ่มฟังก์ชันรับเรื่อง (Create)
  @Post('issues')
  create(@Body() dto: any) {
    return this.issueService.create(dto);
  }

  @Post('issues/:id/resolve')
  resolve(@Param('id') id: string) {
    return this.issueService.resolve(id);
  }

  // 🟢 เพิ่มส่วนนี้เข้าไปครับ (สำคัญมาก!)
  // รองรับคำสั่ง: PATCH /api/reports/issues/:id/status
  @Patch('issues/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string } // รับค่า status ใหม่จากหน้าบ้าน
  ) {
    return this.issueService.updateStatus(id, body.status);
  }
}