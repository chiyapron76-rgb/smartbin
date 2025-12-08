import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppRatingService } from './app-rating.service';
import { CreateAppRatingDto } from './create-app-rating.dto';

@Controller('app-rating')
export class AppRatingController {
  constructor(private readonly service: AppRatingService) {}

  @Post()
  create(@Body() dto: CreateAppRatingDto) {
    return this.service.create(dto);
  }

  // admin: list (or device filter)
  @Get()
  list(@Query('device_uuid') device_uuid?: string) {
    return this.service.findAll(device_uuid);
  }

  @Get('summary')
  summary() {
    return this.service.summary();
  }
}
