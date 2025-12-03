import { Controller, Get, Param } from "@nestjs/common";
import { AlertService } from "./alert.service";

@Controller("alerts")
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  // GET /api/alerts
  @Get()
  async getAll() {
    return this.alertService.getAll();
  }

  // GET /api/alerts/:binId
  @Get(":binId")
  async getByBin(@Param("binId") binId: string) {
    return this.alertService.getByBinId(binId);
  }
}
