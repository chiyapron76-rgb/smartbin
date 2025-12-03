import { Body, Controller, Get, Param, Post, Res, HttpStatus } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('')
export class SensorController {
  constructor(private service: SensorService) {}

  @Post('sensor-record')
  async postSensorRecord(@Body() body: any, @Res() res) {
    try {
      const record = await this.service.createRecord(body);
      return res.status(HttpStatus.CREATED).json(record);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get('bins/:code/records')
  async getRecords(@Param('code') code: string) {
    return this.service.getRecentRecords(code);
  }

  @Get('bins')
  async binsOverview() {
    return this.service.getBinsOverview();
  }
}
