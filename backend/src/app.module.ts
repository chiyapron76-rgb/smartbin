import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SensorModule } from './sensor/sensor.module';
import { BinModule } from './bin/bin.module';
import { AlertModule } from './alert/alert.module';
import { TaskModule } from './task/task.module'; 
import { DashboardModule } from './dashboard/dashboard.module';
import { IssueModule } from './issue/issue.module';
@Module({
  imports: [PrismaModule, SensorModule, BinModule, AlertModule, TaskModule,DashboardModule,IssueModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
