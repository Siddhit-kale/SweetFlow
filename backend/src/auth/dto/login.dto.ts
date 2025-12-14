import { IsEmail, IsString } from 'class-validator';

/**
 * Login DTO
 * Validates user login input
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}


