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
    // 1) Check if issue exists
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
        status: 'resolved',                // <———— IMPORTANT
        resolved_at: new Date(),          // timestamp
        // resolved_by: <admin_id_if_have_auth>
      },
    });

    return {
      message: 'Issue resolved successfully',
      issue: updated,
    };
  }
}
