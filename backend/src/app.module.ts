import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SensorModule } from './sensor/sensor.module';
import { BinModule } from './bin/bin.module';
import { AlertModule } from './alert/alert.module';
import { TaskModule } from './task/task.module'; 
import { DashboardModule } from './dashboard/dashboard.module';
import { IssueModule } from './issue/issue.module';
import { CitizenReportModule } from './citizen-report/citizen-report.module';
import { AppRatingModule } from './app-rating/app-rating.module';
@Module({
  imports: [PrismaModule, SensorModule, BinModule, AlertModule, TaskModule,DashboardModule,IssueModule,CitizenReportModule,AppRatingModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
