import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateMechanicDto {
 @IsString() @MaxLength(100) name: string;
 @IsEmail() @MaxLength(180) email: string;
 @IsString() @MaxLength(100) specialty: string;
 @IsOptional() @IsBoolean() active?: boolean;
}
