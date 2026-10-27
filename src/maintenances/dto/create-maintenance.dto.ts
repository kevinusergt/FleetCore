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
export class CreateMaintenanceDto {
  @IsEnum(MaintenanceType) type: MaintenanceType;
  @IsString() 
  description: string;
  @IsInt() @Min(0) mileage: number;
  @IsDateString() scheduledAt: string;
  @IsOptional() @IsDateString() scheduledEndAt?: string;
  @IsInt() @Min(1) vehicleId: number;
  @IsInt() @Min(1) mechanicId: number;
  @IsInt() @Min(1) workshopId: number;
}
