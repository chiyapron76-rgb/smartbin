import { IsOptional, IsNumber, IsString } from 'class-validator';

export class CompleteTaskItemDto {
  @IsOptional()
  @IsNumber()
  gps_lat?: number;

  @IsOptional()
  @IsNumber()
  gps_lng?: number;

  @IsOptional()
  @IsString()
  collector_note?: string;
}
