import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IssueService {
  constructor(private prisma: PrismaService) {}

  // 🟢 1. เพิ่มฟังก์ชัน Create
  async create(data: any) {
    // ต้องมี bin_id เสมอ เพื่อรู้ว่าถังไหนเสีย
    return this.prisma.issueReport.create({
      data: {
        bin_id: data.bin_id,
        description: data.description,
        issue_type: data.issue_type || 'general',
        status: 'open', // สถานะเริ่มต้นคือ "รอดำเนินการ"
      },
    });
  }

  async getAll() {
    return this.prisma.issueReport.findMany({
      include: { bin: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async resolve(id: string) {
    const issue = await this.prisma.issueReport.findUnique({
      where: { id },
    });

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    const updated = await this.prisma.issueReport.update({
      where: { id },
      data: {
        status: 'resolved',
        resolved_at: new Date(),
      },
    });

    return {
      message: 'Issue resolved successfully',
      issue: updated,
    };
  }
}