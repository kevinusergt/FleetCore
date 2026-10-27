import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({
    example:'juan'
  })
  @IsString() 
  @MinLength(2) 
  @MaxLength(100) 
  username: string;

  @ApiProperty({
    example:'juan@fleetcore.local'
  })
  @IsEmail() 
  @MaxLength(180) 
  email: string;

  @ApiProperty({
    example: 'Tech12345!',
  })
  @IsString() 
  @MinLength(8) 
  @MaxLength(72) 
  password: string;
}
