import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateWorkshopDto {
  @IsString() 
  @MaxLength(120) 
  name: string;
  @IsString() 
  @MaxLength(240) 
  address: string;
  @IsOptional() 
  @IsBoolean() 
  active?: boolean;
}
