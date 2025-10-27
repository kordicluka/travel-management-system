import { Test, TestingModule } from '@nestjs/testing';
import { AirlinesService } from './airlines.service';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@travel-management-system/database';
import { AirlineQueryDto } from './airlines.dto';

const mockDatabaseService = {
  airline: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('AirlinesService', () => {
  let service: AirlinesService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirlinesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<AirlinesService>(AirlinesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an airline', async () => {
      const createAirlineDto = { name: 'Test Airline', baseCountry: 'Testland', servicedAirportIds: ['1'] };
      const expectedAirline = { id: '1', ...createAirlineDto, createdAt: new Date(), updatedAt: new Date(), servicedAirports: [], operatedRoutes: [] };

      mockDatabaseService.airline.create.mockResolvedValue(expectedAirline);

      const result = await service.create(createAirlineDto);

      expect(databaseService.airline.create).toHaveBeenCalledWith({
        data: {
          name: createAirlineDto.name,
          baseCountry: createAirlineDto.baseCountry,
          servicedAirports: {
            connect: createAirlineDto.servicedAirportIds.map((id) => ({ id })),
          },
        },
      });
      expect(result).toEqual(expectedAirline);
    });

    it('should throw an error if the airline name already exists', async () => {
      const createAirlineDto = { name: 'Test Airline', baseCountry: 'Testland', servicedAirportIds: ['1'] };

      mockDatabaseService.airline.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Duplicate key', { code: 'P2002', clientVersion: '' }),
      );

      await expect(service.create(createAirlineDto)).rejects.toThrow(
        new Prisma.PrismaClientKnownRequestError('Duplicate key', { code: 'P2002', clientVersion: '' }),
      );
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of airlines', async () => {
      const query: AirlineQueryDto = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      };
      const airlines = [{ id: '1', name: 'Test Airline', baseCountry: 'Testland', createdAt: new Date(), updatedAt: new Date(), servicedAirports: [], operatedRoutes: [] }];
      const total = 1;

      mockDatabaseService.$transaction.mockResolvedValue([airlines, total]);

      const result = await service.findAll(query);

      expect(databaseService.$transaction).toHaveBeenCalled();
      expect(result).toEqual({
        data: airlines,
        meta: {
          total,
          page: query.page,
          limit: query.limit,
          lastPage: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single airline', async () => {
      const airline = { id: '1', name: 'Test Airline', baseCountry: 'Testland', createdAt: new Date(), updatedAt: new Date(), servicedAirports: [], operatedRoutes: [] };
      mockDatabaseService.airline.findUnique.mockResolvedValue(airline);

      const result = await service.findOne({ id: '1' });

      expect(databaseService.airline.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: undefined,
      });
      expect(result).toEqual(airline);
    });

    it('should return null if the airline does not exist', async () => {
      mockDatabaseService.airline.findUnique.mockResolvedValue(null);

      const result = await service.findOne({ id: '1' });

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an airline', async () => {
      const updateAirlineDto = { name: 'Updated Airline' };
      const airline = { id: '1', name: 'Updated Airline', baseCountry: 'Testland', createdAt: new Date(), updatedAt: new Date(), servicedAirports: [], operatedRoutes: [] };
      mockDatabaseService.airline.update.mockResolvedValue(airline);

      const result = await service.update({ id: '1' }, updateAirlineDto);

      expect(databaseService.airline.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateAirlineDto,
      });
      expect(result).toEqual(airline);
    });

    it('should throw an error if the airline does not exist', async () => {
      const updateAirlineDto = { name: 'Updated Airline' };

      mockDatabaseService.airline.update.mockRejectedValue(new Error('Airline not found'));

      await expect(service.update({ id: '1' }, updateAirlineDto)).rejects.toThrow(
        new Error('Airline not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete an airline', async () => {
      const airline = { id: '1', name: 'Test Airline', baseCountry: 'Testland', createdAt: new Date(), updatedAt: new Date(), servicedAirports: [], operatedRoutes: [] };
      mockDatabaseService.airline.delete.mockResolvedValue(airline);

      const result = await service.remove({ id: '1' });

      expect(databaseService.airline.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(airline);
    });

    it('should throw an error if the airline does not exist', async () => {
      mockDatabaseService.airline.delete.mockRejectedValue(new Error('Airline not found'));

      await expect(service.remove({ id: '1' })).rejects.toThrow(new Error('Airline not found'));
    });
  });
});