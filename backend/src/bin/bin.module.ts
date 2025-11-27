import { Module } from '@nestjs/common';
import { BinController } from './bin.controller';
import { BinService } from './bin.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BinController],
  providers: [BinService, PrismaService],
})
export class BinModule {}
