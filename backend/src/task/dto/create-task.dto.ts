import { IsString, IsArray, ArrayNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  created_by: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  bin_ids: string[];   // <-- ใช้ชื่อที่สื่อว่าคือ Bin.id จริงๆ
}
