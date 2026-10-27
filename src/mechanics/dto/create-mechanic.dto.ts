import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateMechanicDto {
  @ApiProperty({ example: 'Ana Torres' })
  @IsString() 
  @MaxLength(100) 
  name: string;
  @ApiProperty({ example: 'ana.torres@fleetcore.local' })
  @IsEmail() 
  @MaxLength(180) 
  email: string;
  @ApiProperty({ example: 'Motor y transmisión' })
  @IsString() 
  @MaxLength(100) 
  specialty: string;
  @ApiPropertyOptional({ example: true })
  @IsOptional() 
  @IsBoolean() 
  active?: boolean;
}
