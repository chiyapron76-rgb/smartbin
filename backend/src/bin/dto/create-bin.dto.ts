import { IsString, IsOptional, IsNumber } from "class-validator";

export class CreateBinDto {
  @IsString()
  zone: string;

  @IsString()
  @IsOptional()
  address_note?: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
