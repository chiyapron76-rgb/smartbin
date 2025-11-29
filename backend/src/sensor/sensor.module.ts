import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { PrismaService } from '../prisma/prisma.service';
import { MockSensorService } from './mock-sensor.service';

@Module({
  controllers: [SensorController],
  providers: [SensorService, PrismaService, MockSensorService],
})
export class SensorModule {}
