import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsPositive,
} from 'class-validator';
import { MaintenanceType } from '../entities/maintenance.entity.js';
import { ApiProperty } from '@nestjs/swagger';
export class CreateMaintenanceDto {
  @ApiProperty({
    example: MaintenanceType.PREVENTIVE,
  })
  @IsEnum(MaintenanceType) 
  type: MaintenanceType;
  @ApiProperty({
    example: 'Oil change and filter replacement',
  })
  @IsString() 
  description: string;
  @ApiProperty({
    example: 82500,
  })
  @IsInt() 
  @Min(0) 
  mileage: number;
  @ApiProperty({
    example: '2026-11-02T09:00:00.000Z',
  })
  @IsDateString() 
  scheduledAt: string;
  @ApiProperty({
    example: '2026-11-02T10:30:00.000Z',
    required: false,
  })
  @IsOptional() 
  @IsDateString() 
  scheduledEndAt?: string;
  @ApiProperty({
    example: 1,
  })
  @IsInt() 
  @Min(1) 
  vehicleId: number;
  @ApiProperty({
    example: 1,
  })
  @IsInt() 
  @Min(1) 
  mechanicId: number;
  @ApiProperty({
    example: 1,
  })
  @IsInt() 
  @Min(1) 
  workshopId: number;
}
