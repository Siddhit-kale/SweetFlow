import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { PurchaseSweetDto } from './dto/purchase-sweet.dto';
import { QuerySweetsDto } from './dto/query-sweets.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

/**
 * Sweets Controller
 * Handles HTTP requests for sweet management endpoints
 * Public endpoints: GET /sweets (view all), GET /sweets/:id (view one), POST /sweets/:id/purchase
 * Admin-only endpoints: POST /sweets (create), PATCH /sweets/:id (update), DELETE /sweets/:id, POST /sweets/:id/restock
 */
@Controller('sweets')
export class SweetsController {
  constructor(private readonly sweetsService: SweetsService) {}

  /**
   * Create a new sweet (Admin only)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createSweetDto: CreateSweetDto) {
    return this.sweetsService.create(createSweetDto);
  }

  /**
   * Get all sweets with optional search and filters
   * Public endpoint - no authentication required
   */
  @Get()
  findAll(@Query() queryDto: QuerySweetsDto) {
    return this.sweetsService.findAll(queryDto);
  }

  /**
   * Get a sweet by id
   * Public endpoint - no authentication required
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sweetsService.findOne(id);
  }

  /**
   * Update a sweet (Admin only)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateSweetDto: UpdateSweetDto) {
    return this.sweetsService.update(id, updateSweetDto);
  }

  /**
   * Delete a sweet (Admin only)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.sweetsService.remove(id);
  }

  /**
   * Purchase a sweet (decreases quantity)
   * Requires authentication
   */
  @Post(':id/purchase')
  @UseGuards(JwtAuthGuard)
  purchase(@Param('id') id: string, @Body() purchaseDto: PurchaseSweetDto) {
    return this.sweetsService.purchase(id, purchaseDto);
  }

  /**
   * Restock a sweet (increases quantity) - Admin only
   */
  @Post(':id/restock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  restock(@Param('id') id: string, @Body() body: { quantity: number }) {
    return this.sweetsService.restock(id, body.quantity);
  }
}


