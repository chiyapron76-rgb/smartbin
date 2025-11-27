import { Controller, Get, Param } from '@nestjs/common';
import { BinService } from './bin.service';

@Controller('api')
export class BinController {
  constructor(private service: BinService) {}

  @Get('bins')
  async all() {
    return this.service.getAllBins();
  }

  @Get('bins/:code')
  async byCode(@Param('code') code: string) {
    return this.service.getBinByCode(code);
  }
}
