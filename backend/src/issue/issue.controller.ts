import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { IssueService } from './issue.service';

@Controller('issues')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @Get()
  getAll() {
    return this.issueService.getAll();
  }

  // 🟢 1. เพิ่มฟังก์ชันรับเรื่อง (Create)
  @Post()
  create(@Body() dto: any) {
    return this.issueService.create(dto);
  }

  @Post(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.issueService.resolve(id);
  }
}