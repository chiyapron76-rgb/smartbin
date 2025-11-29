import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SensorModule } from './sensor/sensor.module';
import { BinModule } from './bin/bin.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [PrismaModule, SensorModule, BinModule, AlertModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
