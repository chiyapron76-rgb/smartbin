import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SensorModule } from './sensor/sensor.module';
import { BinModule } from './bin/bin.module';
import { MockSensorService } from './sensor/mock-sensor.service';

@Module({
  imports: [PrismaModule, SensorModule, BinModule],
  providers: [MockSensorService],  // ใช้ชื่อที่ถูกต้อง
})
export class AppModule {}
