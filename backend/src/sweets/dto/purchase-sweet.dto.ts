import { IsNumber, IsPositive, Min } from 'class-validator';

/**
 * Purchase Sweet DTO
 * Validates input for purchasing a sweet
 */
export class PurchaseSweetDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}


