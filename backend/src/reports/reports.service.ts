import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// 🟢 1. Import Enum เข้ามา (เพื่อให้ Prisma รู้จักค่า Status)
import { IssueStatus, CitizenReportStatus } from '@prisma/client'; 

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // --- เจ้าหน้าที่ ---
  async getAllIssues() {
    return this.prisma.issueReport.findMany({
      include: { bin: true },
      orderBy: { created_at: 'desc' }
    });
  }

  async updateIssueStatus(id: string, status: string) {
    return this.prisma.issueReport.update({
      where: { id },
      data: { 
        // 🟢 2. แปลง string เป็น Enum (ใช้ as IssueStatus)
        status: status as IssueStatus 
      }
    });
  }

  // --- ประชาชน ---
  async getAllCitizenReports() {
    return this.prisma.citizenReport.findMany({
      include: { bin: true },
      orderBy: { created_at: 'desc' }
    });
  }

  async updateCitizenStatus(id: string, status: string) {
    return this.prisma.citizenReport.update({
      where: { id },
      data: { 
        // 🟢 3. แปลง string เป็น Enum (ใช้ as CitizenReportStatus)
        status: status as CitizenReportStatus 
      }
    });
  }
}