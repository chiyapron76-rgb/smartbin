import { Module } from '@nestjs/common';
import { AppRatingService } from './app-rating.service';
import { AppRatingController } from './app-rating.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AppRatingService],
  controllers: [AppRatingController],
  exports: [AppRatingService],
})
export class AppRatingModule {}
