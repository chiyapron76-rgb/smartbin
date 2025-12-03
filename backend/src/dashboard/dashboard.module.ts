// backend/src/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AlertModule } from '../alert/alert.module';
import { BinModule } from '../bin/bin.module';
import { TaskModule } from '../task/task.module'; // optional - exists in app.module.ts of your project

@Module({
  imports: [PrismaModule, AlertModule, BinModule, TaskModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
