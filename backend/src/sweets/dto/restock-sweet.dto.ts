import { IsNumber, IsPositive, Min } from 'class-validator';

/**
 * Restock Sweet DTO
 * Validates input for restocking a sweet
 */
export class RestockSweetDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}


