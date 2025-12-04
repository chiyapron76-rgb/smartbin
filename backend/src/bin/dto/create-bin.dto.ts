import { IsString, IsOptional, IsNumber } from "class-validator";

export class CreateBinDto {
  @IsString()
  @IsOptional()
  bin_code?: string;

  @IsString()
  @IsOptional()
  zone?: string;

  @IsString()
  @IsOptional()
  address_note?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}
