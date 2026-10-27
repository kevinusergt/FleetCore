import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
export class LoginDto {
  @ApiProperty({
    example: 'pedro@fleetcore.local'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Tech12345!'
  })
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password: string;
}
