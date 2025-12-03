import { IsString, IsOptional, IsEnum } from "class-validator";

export enum IssueTypeEnum {
  broken = "broken",
  blocked = "blocked",
  sensor_error = "sensor_error",
  location_wrong = "location_wrong",
  vandalized = "vandalized",
  others = "others",
}

export class ReportIssueDto {
  @IsString()
  bin_id: string;

  @IsEnum(IssueTypeEnum)
  issue_type: IssueTypeEnum;

  @IsOptional()
  @IsString()
  description?: string;
}
