import { IsString, IsUUID } from 'class-validator';

export class StartTaskDto {
  @IsString()
  @IsUUID()
  started_by: string; // collector id
}
