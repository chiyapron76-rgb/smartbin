import { Injectable } from '@nestjs/common';
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
    return this.prisma.issueReport.update({
      where: { id },
      data: { resolved_at: new Date() },
    });
  }
}
