import { Controller, Get, Post, Param } from '@nestjs/common';
import { IssueService } from './issue.service';

@Controller('issues')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @Get()
  getAll() {
    return this.issueService.getAll();
  }

  @Post(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.issueService.resolve(id);
  }
}
