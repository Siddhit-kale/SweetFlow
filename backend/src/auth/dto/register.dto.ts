import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Register DTO
 * Validates user registration input
 */
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}


