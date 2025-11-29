import { Controller, Get, Param } from "@nestjs/common";
import { AlertService } from "./alert.service";

@Controller("api/alerts")
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Get()
  async getAll() {
    return this.alertService.getAllAlerts();
  }

  @Get(":binId")
  async getByBin(@Param("binId") binId: string) {
    return this.alertService.getAlertsByBin(binId);
  }
}
