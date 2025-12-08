import { Body, Controller, Get, Param, Post, HttpException, HttpStatus } from "@nestjs/common";
import { BinService } from "./bin.service";
import { CreateBinDto } from "./dto/create-bin.dto";

@Controller("bins")
export class BinController {
  constructor(private service: BinService) {}

  @Post()
  async create(@Body() createBinDto: CreateBinDto) {
    try {
      return await this.service.create(createBinDto);
    } catch (err) {
      throw new HttpException(
        { message: "Failed to create bin", detail: err?.message || err },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async all() {
    return this.service.getAll();
  }

  // ✔ ต้องวาง public route ไว้ "ก่อน" dynamic route
  @Get("public")
  getPublicBins() {
    return this.service.getAll();
  }

  @Get(":code")
  async byCode(@Param("code") code: string) {
    return this.service.getByCode(code);
  }
}
