import { CreateSweetDto } from './create-sweet.dto';
import { IsOptional, IsString, IsNumber, IsPositive, Min } from 'class-validator';

/**
 * Update Sweet DTO
 * Validates input for updating a sweet
 * All fields are optional
 */
export class UpdateSweetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;
}

