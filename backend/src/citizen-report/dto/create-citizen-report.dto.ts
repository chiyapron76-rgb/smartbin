import { IsString, IsEnum, IsOptional, IsNumber } from "class-validator";
import { CitizenIssueType } from "@prisma/client";

export class CreateCitizenReportDto {
  @IsString()
  bin_id: string;

  @IsEnum(CitizenIssueType)
  issue_type: CitizenIssueType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  device_uuid?: string;

  @IsOptional()
  @IsNumber()
  location_lat?: number;

  @IsOptional()
  @IsNumber()
  location_lng?: number;
}
