import { IsInt, IsOptional, IsString, Min, Max, IsEnum } from 'class-validator';
import { RatingPlatform } from '@prisma/client';

export class CreateAppRatingDto {
  @IsOptional()
  @IsString()
  device_uuid?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  app_version?: string;

  @IsOptional()
  @IsEnum(RatingPlatform)
  platform?: RatingPlatform;

  @IsOptional()
  @IsString()
  device_info?: string;
}
