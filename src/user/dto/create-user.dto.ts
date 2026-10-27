import { IsEmail, IsString, MinLength, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;

    
    role?: string;

}
