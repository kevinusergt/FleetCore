import { IsString, IsInt, Min, Max, IsEnum, MaxLength } from 'class-validator';
import { VehicleStatus } from '../entities/vehicle.entity.js';
export class CreateVehicleDto {
  @IsString() 
  @MaxLength(20) 
  plate: string;
  @IsString() 
  @MaxLength(80) 
  brand: string;
  @IsString() 
  @MaxLength(80) 
  model: string;
  @IsInt() 
  @Min(1950) 
  @Max(new Date().getFullYear() + 1) 
  year: number;
  @IsInt() 
  @Min(0) 
  mileage: number;
  @IsEnum(VehicleStatus) 
  status?: VehicleStatus;
}
