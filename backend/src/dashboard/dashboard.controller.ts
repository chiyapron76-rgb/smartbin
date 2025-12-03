// backend/src/dashboard/dashboard.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('summary')
  async getSummary() {
    return this.service.getSummary();
  }

  @Get('zones')
  async getZones() {
    return this.service.getZoneStats();
  }

  @Get('trends')
  async getTrends(@Query('days') days?: string) {
    const d = days ? parseInt(days, 10) : 7;
    return this.service.getTrends(d);
  }

  @Get('devices')
  async getDevices() {
    return this.service.getDeviceHealth();
  }

  @Get('alerts/recent')
  async getRecentAlerts() {
    return this.service.getRecentAlerts();
  }

  @Get('tasks/summary')
  async getTasksSummary() {
    return this.service.getTasksSummary();
  }

  @Get('citizen-reports/summary')
  async getCitizenReportsSummary() {
    return this.service.getCitizenReportsSummary();
  }
}
