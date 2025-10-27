import { Test, TestingModule } from '@nestjs/testing';
import { AirportsService } from './airports.service';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@travel-management-system/database';
import { AirportQueryDto } from './airports.dto';

const mockDatabaseService = {
  airport: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('AirportsService', () => {
  let service: AirportsService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirportsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<AirportsService>(AirportsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an airport', async () => {
      const createAirportDto = {
        name: 'Test Airport',
        code: 'TST',
        country: 'Testland',
        latitude: 0,
        longitude: 0,
      };
      const expectedAirport = { id: '1', ...createAirportDto, createdAt: new Date(), updatedAt: new Date(), servicedByAirlines: [], routesFrom: [], routesTo: [] };

      mockDatabaseService.airport.create.mockResolvedValue(expectedAirport);

      const result = await service.create(createAirportDto);

      expect(databaseService.airport.create).toHaveBeenCalledWith({
        data: createAirportDto,
      });
      expect(result).toEqual(expectedAirport);
    });

    it('should throw an error if the airport code already exists', async () => {
      const createAirportDto = {
        name: 'Test Airport',
        code: 'TST',
        country: 'Testland',
        latitude: 0,
        longitude: 0,
      };

      mockDatabaseService.airport.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Duplicate key', { code: 'P2002', clientVersion: '' }),
      );

      await expect(service.create(createAirportDto)).rejects.toThrow(
        new Prisma.PrismaClientKnownRequestError('Duplicate key', { code: 'P2002', clientVersion: '' }),
      );
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of airports', async () => {
      const query: AirportQueryDto = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      };
      const airports = [{ id: '1', name: 'Test Airport', code: 'TST', country: 'Testland', latitude: 0, longitude: 0, createdAt: new Date(), updatedAt: new Date(), servicedByAirlines: [], routesFrom: [], routesTo: [] }];
      const total = 1;

      mockDatabaseService.$transaction.mockResolvedValue([airports, total]);

      const result = await service.findAll(query);

      expect(databaseService.$transaction).toHaveBeenCalled();
      expect(result).toEqual({
        data: airports,
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
    it('should return a single airport', async () => {
      const airport = { id: '1', name: 'Test Airport', code: 'TST', country: 'Testland', latitude: 0, longitude: 0, createdAt: new Date(), updatedAt: new Date(), servicedByAirlines: [], routesFrom: [], routesTo: [] };
      mockDatabaseService.airport.findUnique.mockResolvedValue(airport);

      const result = await service.findOne({ id: '1' });

      expect(databaseService.airport.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: undefined,
      });
      expect(result).toEqual(airport);
    });

    it('should return null if the airport does not exist', async () => {
      mockDatabaseService.airport.findUnique.mockResolvedValue(null);

      const result = await service.findOne({ id: '1' });

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an airport', async () => {
      const updateAirportDto = { name: 'Updated Airport' };
      const airport = { id: '1', name: 'Updated Airport', code: 'TST', country: 'Testland', latitude: 0, longitude: 0, createdAt: new Date(), updatedAt: new Date(), servicedByAirlines: [], routesFrom: [], routesTo: [] };
      mockDatabaseService.airport.update.mockResolvedValue(airport);

      const result = await service.update({ id: '1' }, updateAirportDto);

      expect(databaseService.airport.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateAirportDto,
      });
      expect(result).toEqual(airport);
    });

    it('should throw an error if the airport does not exist', async () => {
      const updateAirportDto = { name: 'Updated Airport' };

      mockDatabaseService.airport.update.mockRejectedValue(new Error('Airport not found'));

      await expect(service.update({ id: '1' }, updateAirportDto)).rejects.toThrow(
        new Error('Airport not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete an airport', async () => {
      const airport = { id: '1', name: 'Test Airport', code: 'TST', country: 'Testland', latitude: 0, longitude: 0, createdAt: new Date(), updatedAt: new Date(), servicedByAirlines: [], routesFrom: [], routesTo: [] };
      mockDatabaseService.airport.delete.mockResolvedValue(airport);

      const result = await service.remove({ id: '1' });

      expect(databaseService.airport.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(airport);
    });

    it('should throw an error if the airport does not exist', async () => {
      mockDatabaseService.airport.delete.mockRejectedValue(new Error('Airport not found'));

      await expect(service.remove({ id: '1' })).rejects.toThrow(new Error('Airport not found'));
    });
  });
});