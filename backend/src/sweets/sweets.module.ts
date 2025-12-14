import { Module } from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { SweetsController } from './sweets.controller';

/**
 * Sweets Module
 * Handles sweet inventory management
 * Provides CRUD operations, purchase, and search functionality
 */
@Module({
  controllers: [SweetsController],
  providers: [SweetsService],
  exports: [SweetsService],
})
export class SweetsModule {}


