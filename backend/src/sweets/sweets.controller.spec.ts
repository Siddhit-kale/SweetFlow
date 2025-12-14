import { Test, TestingModule } from '@nestjs/testing';
import { SweetsController } from './sweets.controller';
import { SweetsService } from './sweets.service';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { PurchaseSweetDto } from './dto/purchase-sweet.dto';
import { Role } from '@prisma/client';

/**
 * Sweets Controller Tests
 * Test Driven Development: Writing tests before implementation
 * Tests cover HTTP endpoints for sweet management
 */
describe('SweetsController', () => {
  let controller: SweetsController;
  let service: SweetsService;

  const mockSweetsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    purchase: jest.fn(),
    restock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SweetsController],
      providers: [
        {
          provide: SweetsService,
          useValue: mockSweetsService,
        },
      ],
    }).compile();

    controller = module.get<SweetsController>(SweetsController);
    service = module.get<SweetsService>(SweetsService);
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

      mockSweetsService.create.mockResolvedValue(expectedSweet);

      const result = await controller.create(createSweetDto);

      expect(result).toEqual(expectedSweet);
      expect(service.create).toHaveBeenCalledWith(createSweetDto);
    });
  });

  describe('findAll', () => {
    it('should return all sweets', async () => {
      const queryDto = {};
      const expectedSweets = [
        {
          id: '507f1f77bcf86cd799439011',
          name: 'Gulab Jamun',
          category: 'Indian',
          price: 50.0,
          quantity: 100,
        },
      ];

      mockSweetsService.findAll.mockResolvedValue(expectedSweets);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(expectedSweets);
      expect(service.findAll).toHaveBeenCalledWith(queryDto);
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

      mockSweetsService.findOne.mockResolvedValue(expectedSweet);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(expectedSweet);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('update', () => {
    it('should update a sweet', async () => {
      const updateSweetDto: UpdateSweetDto = {
        name: 'Gulab Jamun Deluxe',
        price: 60.0,
      };

      const updatedSweet = {
        id: '507f1f77bcf86cd799439011',
        name: 'Gulab Jamun Deluxe',
        category: 'Indian',
        price: 60.0,
        quantity: 100,
      };

      mockSweetsService.update.mockResolvedValue(updatedSweet);

      const result = await controller.update('507f1f77bcf86cd799439011', updateSweetDto);

      expect(result).toEqual(updatedSweet);
      expect(service.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateSweetDto);
    });
  });

  describe('remove', () => {
    it('should delete a sweet', async () => {
      mockSweetsService.remove.mockResolvedValue(undefined);

      await controller.remove('507f1f77bcf86cd799439011');

      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('purchase', () => {
    it('should purchase a sweet', async () => {
      const purchaseDto: PurchaseSweetDto = { quantity: 5 };
      const updatedSweet = {
        id: '507f1f77bcf86cd799439011',
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50.0,
        quantity: 95,
      };

      mockSweetsService.purchase.mockResolvedValue(updatedSweet);

      const result = await controller.purchase('507f1f77bcf86cd799439011', purchaseDto);

      expect(result).toEqual(updatedSweet);
      expect(service.purchase).toHaveBeenCalledWith('507f1f77bcf86cd799439011', purchaseDto);
    });
  });

  describe('restock', () => {
    it('should restock a sweet', async () => {
      const updatedSweet = {
        id: '507f1f77bcf86cd799439011',
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50.0,
        quantity: 150,
      };

      mockSweetsService.restock.mockResolvedValue(updatedSweet);

      const result = await controller.restock('507f1f77bcf86cd799439011', { quantity: 50 });

      expect(result).toEqual(updatedSweet);
      expect(service.restock).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 50);
    });
  });
});
