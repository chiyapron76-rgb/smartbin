import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from "@nestjs/common";
import { BinService } from "./bin.service";
import { CreateBinDto } from "./dto/create-bin.dto";
import { UpdateBinDto } from "./dto/update-bin.dto";

@Controller("bins")
export class BinController {
  constructor(private service: BinService) {}

  @Post()
  create(@Body() dto: CreateBinDto) {
    return this.service.create(dto);
  }

  @Get()
  all() {
    return this.service.getAll();
  }

  @Get("public")
  getPublic() {
    return this.service.getPublicBins();
  }

  @Get("id/:id")
  getSmartBin(@Param("id") id: string) {
    return this.service.getSmartBinById(id);
  }

  @Get("code/:code")
  getByCode(@Param("code") code: string) {
    return this.service.getByCode(code);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateBinDto) {
    return this.service.updateBin(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.deleteBin(id);
  }
}
