import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MaintenanceStatus } from '../entities/maintenance.entity.js';
export class UpdateMaintenanceDto {
 @IsOptional() @IsEnum(MaintenanceStatus) status?: MaintenanceStatus;
 @IsOptional() @IsString() workPerformed?: string;
 @IsOptional() @IsNumber() @Min(0) finalCost?: number;
 @IsOptional() @IsDateString() completedAt?: string;
 @IsOptional() @IsInt() @Min(0) finalMileage?: number;
}
