import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@contact-api.com' })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({ example: 'MotDePasseAdmin123!' })
  @IsString()
  @IsNotEmpty({ message: 'Mot de passe obligatoire' })
  password: string;
}