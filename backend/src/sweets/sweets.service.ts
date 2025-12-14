import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { PurchaseSweetDto } from './dto/purchase-sweet.dto';
import { QuerySweetsDto } from './dto/query-sweets.dto';
import { Prisma } from '@prisma/client';

/**
 * Sweets Service
 * Business logic for sweet management
 * Handles CRUD operations, purchase, restock, and search functionality
 */
@Injectable()
export class SweetsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new sweet (Admin only)
   * @param createSweetDto - Sweet data
   * @returns Created sweet
   */
  async create(createSweetDto: CreateSweetDto) {
    return this.prisma.sweet.create({
      data: createSweetDto,
    });
  }

  /**
   * Find all sweets with optional filters
   * @param queryDto - Search and filter parameters
   * @returns Array of sweets matching criteria
   */
  async findAll(queryDto: QuerySweetsDto) {
    const where: Prisma.SweetWhereInput = {};

    // Filter by name (case-insensitive search)
    if (queryDto.name) {
      where.name = {
        contains: queryDto.name,
        mode: 'insensitive',
      };
    }

    // Filter by category (case-insensitive search)
    if (queryDto.category) {
      where.category = {
        contains: queryDto.category,
        mode: 'insensitive',
      };
    }

    // Filter by price range
    if (queryDto.minPrice !== undefined || queryDto.maxPrice !== undefined) {
      where.price = {};
      if (queryDto.minPrice !== undefined) {
        where.price.gte = queryDto.minPrice;
      }
      if (queryDto.maxPrice !== undefined) {
        where.price.lte = queryDto.maxPrice;
      }
    }

    return this.prisma.sweet.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find a sweet by id
   * @param id - Sweet id (MongoDB ObjectId as string)
   * @returns Sweet object
   * @throws NotFoundException if sweet not found
   */
  async findOne(id: string) {
    const sweet = await this.prisma.sweet.findUnique({
      where: { id },
    });

    if (!sweet) {
      throw new NotFoundException(`Sweet with ID ${id} not found`);
    }

    return sweet;
  }

  /**
   * Update a sweet (Admin only)
   * @param id - Sweet id (MongoDB ObjectId as string)
   * @param updateSweetDto - Updated sweet data
   * @returns Updated sweet
   * @throws NotFoundException if sweet not found
   */
  async update(id: string, updateSweetDto: UpdateSweetDto) {
    // Check if sweet exists
    await this.findOne(id);

    return this.prisma.sweet.update({
      where: { id },
      data: updateSweetDto,
    });
  }

  /**
   * Delete a sweet (Admin only)
   * @param id - Sweet id (MongoDB ObjectId as string)
   * @throws NotFoundException if sweet not found
   */
  async remove(id: string) {
    // Check if sweet exists
    await this.findOne(id);

    await this.prisma.sweet.delete({
      where: { id },
    });
  }

  /**
   * Purchase a sweet (decreases quantity)
   * @param id - Sweet id (MongoDB ObjectId as string)
   * @param purchaseDto - Purchase data (quantity)
   * @returns Updated sweet with new quantity
   * @throws NotFoundException if sweet not found
   * @throws BadRequestException if quantity is zero or insufficient
   */
  async purchase(id: string, purchaseDto: PurchaseSweetDto) {
    const sweet = await this.findOne(id);

    // Check if sweet is out of stock
    if (sweet.quantity === 0) {
      throw new BadRequestException('Sweet is out of stock');
    }

    // Check if requested quantity exceeds available
    if (purchaseDto.quantity > sweet.quantity) {
      throw new BadRequestException(
        `Insufficient quantity. Available: ${sweet.quantity}, Requested: ${purchaseDto.quantity}`,
      );
    }

    // Decrease quantity
    const newQuantity = sweet.quantity - purchaseDto.quantity;

    return this.prisma.sweet.update({
      where: { id },
      data: { quantity: newQuantity },
    });
  }

  /**
   * Restock a sweet (increases quantity) - Admin only
   * @param id - Sweet id (MongoDB ObjectId as string)
   * @param quantity - Quantity to add
   * @returns Updated sweet with new quantity
   * @throws NotFoundException if sweet not found
   */
  async restock(id: string, quantity: number) {
    const sweet = await this.findOne(id);

    const newQuantity = sweet.quantity + quantity;

    return this.prisma.sweet.update({
      where: { id },
      data: { quantity: newQuantity },
    });
  }
}


