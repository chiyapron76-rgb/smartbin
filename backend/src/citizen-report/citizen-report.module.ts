import { Module } from "@nestjs/common";
import { CitizenReportService } from "./citizen-report.service";
import { CitizenReportController } from "./citizen-report.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [CitizenReportService],
  controllers: [CitizenReportController],
})
export class CitizenReportModule {}
