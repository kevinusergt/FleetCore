import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceStatus } from '../entities/maintenance.entity.js';
export class UpdateMaintenanceDto {
  @ApiProperty({ example: MaintenanceStatus.IN_PROGRESS, required: false })
  @IsOptional() 
  @IsEnum(MaintenanceStatus) 
  status?: MaintenanceStatus;
  @ApiProperty({ example: 'Replaced oil and filter', required: false })
  @IsOptional() 
  @IsString() 
  workPerformed?: string;
  @ApiProperty({ example: 125.5, required: false })
  @IsOptional() 
  @IsNumber() @Min(0) 
  finalCost?: number;
  @ApiProperty({ example: '2026-11-02T10:30:00.000Z', required: false })
  @IsOptional() 
  @IsDateString() 
  completedAt?: string;
  @ApiProperty({ example: 82500, required: false })
  @IsOptional() 
  @IsInt() 
  @Min(0) 
  finalMileage?: number;
}
