// src/auth/dto/login-auth.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
