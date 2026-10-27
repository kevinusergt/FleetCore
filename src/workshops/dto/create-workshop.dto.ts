import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateWorkshopDto {
  @ApiProperty({ example: 'Taller Central FleetCore' })
  @IsString() 
  @MaxLength(120) 
  name: string;
  @ApiProperty({ example: 'Av. del Parque 123, Madrid' })
  @IsString() 
  @MaxLength(240) 
  address: string;
  @ApiPropertyOptional({ example: true })
  @IsOptional() 
  @IsBoolean() 
  active?: boolean;
}
