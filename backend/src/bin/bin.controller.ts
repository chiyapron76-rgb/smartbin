import { Controller, Get, Param } from "@nestjs/common";
import { BinService } from "./bin.service";

@Controller("api")
export class BinController {
  constructor(private service: BinService) {}

  @Get("bins")
  async all() {
    return this.service.getAll(); // << ใช้ชื่อใหม่!
  }

  @Get("bins/:code")
  async byCode(@Param("code") code: string) {
    return this.service.getByCode(code); // << ใช้ชื่อใหม่!
  }
}
