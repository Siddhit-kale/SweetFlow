import { Test, TestingModule } from '@nestjs/testing';
import { SweetsService } from './sweets.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { PurchaseSweetDto } from './dto/purchase-sweet.dto';
import { QuerySweetsDto } from './dto/query-sweets.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

/**
 * Sweets Service Tests
 * Test Driven Development: Writing tests before implementation
 * Tests cover CRUD operations, purchase, and search functionality
 */
describe('SweetsService', () => {
  let service: SweetsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    sweet: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SweetsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SweetsService>(SweetsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new sweet', async () => {
      const createSweetDto: CreateSweetDto = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50.0,
        quantity: 100,
      };

      const expectedSweet = {
        id: '507f1f77bcf86cd799439011',
        ...createSweetDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.sweet.create.mockResolvedValue(expectedSweet);

      const result = await service.create(createSweetDto);

      expect(result).toEqual(expectedSweet);
      expect(mockPrismaService.sweet.create).toHaveBeenCalledWith({
        data: createSweetDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all sweets when no filters provided', async () => {
      const expectedSweets = [
        {
          id: '507f1f77bcf86cd799439011',
          name: 'Gulab Jamun',
          category: 'Indian',
          price: 50.0,
          quantity: 100,
        },
        {
          id: '507f1f77bcf86cd799439012',
          name: 'Rasgulla',
          category: 'Indian',
          price: 40.0,
          quantity: 80,
        },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(expectedSweets);

      const result = await service.findAll({});

      expect(result).toEqual(expectedSweets);
      expect(mockPrismaService.sweet.findMany).toHaveBeenCalled();
    });

    it('should filter sweets by name', async () => {
      const queryDto: QuerySweetsDto = { name: 'Gulab' };
      const expectedSweets = [
        {
          id: '507f1f77bcf86cd799439011',
          name: 'Gulab Jamun',
          category: 'Indian',
          price: 50.0,
          quantity: 100,
        },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(expectedSweets);

      const result = await service.findAll(queryDto);

      expect(result).toEqual(expectedSweets);
      expect(mockPrismaService.sweet.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          name: { contains: 'Gulab', mode: 'insensitive' },
        }),
      });
    });

    it('should filter sweets by category', async () => {
      const queryDto: QuerySweetsDto = { category: 'Indian' };
      const expectedSweets = [
        {
          id: '507f1f77bcf86cd799439011',
          name: 'Gulab Jamun',
          category: 'Indian',
          price: 50.0,
          quantity: 100,
        },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(expectedSweets);

      const result = await service.findAll(queryDto);

      expect(result).toEqual(expectedSweets);
      expect(mockPrismaService.sweet.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          category: { contains: 'Indian', mode: 'insensitive' },
        }),
      });
    });

    it('should filter sweets by price range', async () => {
      const queryDto: QuerySweetsDto = { minPrice: 30, maxPrice: 60 };
      const expectedSweets = [
        {
          id: '507f1f77bcf86cd799439011',
          name: 'Gulab Jamun',
          category: 'Indian',
          price: 50.0,
          quantity: 100,
        },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(expectedSweets);

      const result = await service.findAll(queryDto);

      expect(result).toEqual(expectedSweets);
      expect(mockPrismaService.sweet.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          price: { gte: 30, lte: 60 },
        }),
      });
    });
  });

  describe('findOne', () => {
    it('should return a sweet by id', async () => {
      const expectedSweet = {
        id: '507f1f77bcf86cd799439011',
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50.0,
        quantity: 100,
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(expectedSweet);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(expectedSweet);
      expect(mockPrismaService.sweet.findUnique).toHaveBeenCalledWith({
        where: { id: '507f1f77bcf86cd799439011' },
      });
    });

    it('should throw NotFoundException if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.findOne('507f1f77bcf86cd799439999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a sweet', async () => {
      const updateSweetDto: UpdateSweetDto = {
        name: 'Gulab Jamun Deluxe',
        price: 60.0,
      };

      const existingSweet = {
        id: '507f1f77bcf86cd799439011',
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50.0,
        quantity: 100,
      };

      const updatedSweet = {
        ...existingSweet,
        ...updateSweetDto,
        updatedAt: new Date(),
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(existingSweet);
      mockPrismaService.sweet.update.mockResolvedValue(updatedSweet);

      const result = await service.update('507f1f77bcf86cd799439011', updateSweetDto);

      expect(result).toEqual(updatedSweet);
      expect(mockPrismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: '507f1f77bcf86cd799439011' },
        data: updateSweetDto,
      });
    });

    it('should throw NotFoundException if sweet not found', async () => {
      const updateSweetDto: UpdateSweetDto = { name: 'New Name' };

      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.update('507f1f77bcf86cd799439999', updateSweetDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a sweet', async () => {
      const existingSweet = {
        id: '507f1f77bcf86cd799439011',
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50.0,
        quantity: 100,
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(existingSweet);
      mockPrismaService.sweet.delete.mockResolvedValue(existingSweet);

      await service.remove('507f1f77bcf86cd799439011');

      expect(mockPrismaService.sweet.delete).toHaveBeenCalledWith({
        where: { id: '507f1f77bcf86cd799439011' },
      });
    });

    it('should throw NotFoundException if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.remove('507f1f77bcf86cd799439999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('purchase', () => {
    it('should purchase a sweet and decrease quantity', async () => {
      const purchaseDto: PurchaseSweetDto = { quantity: 5 };
      const existingSweet = {
        id: '507f1f77bcf86cd799439011',
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50.0,
        quantity: 100,
      };

      const updatedSweet = {
        ...existingSweet,
        quantity: 95,
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(existingSweet);
      mockPrismaService.sweet.update.mockResolvedValue(updatedSweet);

      const result = await service.purchase('507f1f77bcf86cd799439011', purchaseDto);

      expect(result.quantity).toBe(95);
      expect(mockPrismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: '507f1f77bcf86cd799439011' },
        data: { quantity: 95 },
      });
    });

    it('should throw NotFoundException if sweet not found', async () => {
      const purchaseDto: PurchaseSweetDto = { quantity: 5 };

      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.purchase('507f1f77bcf86cd799439999', purchaseDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if quantity is zero', async () => {
      const purchaseDto: PurchaseSweetDto = { quantity: 5 };
      const existingSweet = {
        id: '507f1f77bcf86cd799439011',
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50.0,
        quantity: 0,
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(existingSweet);

      await expect(service.purchase('507f1f77bcf86cd799439011', purchaseDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPrismaService.sweet.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if requested quantity exceeds available', async () => {
      const purchaseDto: PurchaseSweetDto = { quantity: 10 };
      const existingSweet = {
        id: '507f1f77bcf86cd799439011',
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50.0,
        quantity: 5,
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(existingSweet);

      await expect(service.purchase('507f1f77bcf86cd799439011', purchaseDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPrismaService.sweet.update).not.toHaveBeenCalled();
    });
  });

  describe('restock', () => {
    it('should increase sweet quantity', async () => {
      const existingSweet = {
        id: '507f1f77bcf86cd799439011',
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50.0,
        quantity: 100,
      };

      const updatedSweet = {
        ...existingSweet,
        quantity: 150,
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(existingSweet);
      mockPrismaService.sweet.update.mockResolvedValue(updatedSweet);

      const result = await service.restock('507f1f77bcf86cd799439011', 50);

      expect(result.quantity).toBe(150);
      expect(mockPrismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: '507f1f77bcf86cd799439011' },
        data: { quantity: 150 },
      });
    });

    it('should throw NotFoundException if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.restock('507f1f77bcf86cd799439999', 50)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
