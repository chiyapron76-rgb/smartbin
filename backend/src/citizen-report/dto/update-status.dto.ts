import { IsEnum } from "class-validator";
import { CitizenReportStatus } from "@prisma/client";

export class UpdateCitizenReportStatusDto {
  @IsEnum(CitizenReportStatus)
  status: CitizenReportStatus;
}
