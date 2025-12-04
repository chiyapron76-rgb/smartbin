import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IssueService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.issueReport.findMany({
      include: { bin: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async resolve(id: string) {
    // 1) Check exist
    const issue = await this.prisma.issueReport.findUnique({
      where: { id },
    });

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    // 2) Update issue
    const updated = await this.prisma.issueReport.update({
      where: { id },
      data: {
        resolved_at: new Date(),
             // <–– เพิ่ม status ที่จำเป็น
        // resolved_by: 'admin-001' // <–– ถ้าอยากใช้ Auth ค่อยเพิ่ม
      },
    });

    return {
      message: 'Issue resolved successfully',
      issue: updated,
    };
  }
}
