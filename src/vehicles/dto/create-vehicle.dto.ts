import { IsString, IsInt, Min, Max, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleStatus } from '../entities/vehicle.entity.js';
export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC-1234' })
  @IsString() 
  @MaxLength(20) 
  plate: string;
  @ApiProperty({ example: 'Toyota' })
  @IsString() 
  @MaxLength(80) 
  brand: string;
  @ApiProperty({ example: 'Corolla' })
  @IsString() 
  @MaxLength(80) 
  model: string;
  @ApiProperty({ example: 2022 })
  @IsInt() 
  @Min(1950) 
  @Max(new Date().getFullYear() + 1) 
  year: number;
  @ApiProperty({ example: 38500 })
  @IsInt() 
  @Min(0) 
  mileage: number;
  @ApiPropertyOptional({ example: VehicleStatus.AVAILABLE })
  @IsEnum(VehicleStatus) 
  status?: VehicleStatus;
}
