import { IsOptional, IsString, IsNumber } from "class-validator";

export class UpdateBinDto {
  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsString()
  address_note?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  status?: string; // ensure value is one of allowed enum strings on client side
}
