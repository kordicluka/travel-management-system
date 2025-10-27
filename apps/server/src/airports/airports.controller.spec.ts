import { Test, TestingModule } from '@nestjs/testing';
import { AirportsController } from './airports.controller';
import { AirportsService } from './airports.service';
import { AirportQueryDto } from './airports.dto';
import { Prisma } from '@travel-management-system/database';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockAirportsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('AirportsController', () => {
  let controller: AirportsController;
  let service: AirportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirportsController],
      providers: [
        {
          provide: AirportsService,
          useValue: mockAirportsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AirportsController>(AirportsController);
    service = module.get<AirportsService>(AirportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an airport', async () => {
      const createAirportDto = { name: 'Test Airport', code: 'TST', country: 'Testland', latitude: 0, longitude: 0 };
      const expectedAirport = { id: '1', ...createAirportDto, createdAt: new Date(), updatedAt: new Date(), servicedByAirlines: [], routesFrom: [], routesTo: [] };

      mockAirportsService.create.mockResolvedValue(expectedAirport);

      const result = await controller.create(createAirportDto);

      expect(service.create).toHaveBeenCalledWith(createAirportDto);
      expect(result).toEqual(expectedAirport);
    });

    it('should throw a PrismaClientKnownRequestError if the airport code already exists', async () => {
      const createAirportDto = { name: 'Test Airport', code: 'TST', country: 'Testland', latitude: 0, longitude: 0 };

      mockAirportsService.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Duplicate key', { code: 'P2002', clientVersion: '' }),
      );

      await expect(controller.create(createAirportDto)).rejects.toThrow(
        new Prisma.PrismaClientKnownRequestError('Duplicate key', { code: 'P2002', clientVersion: '' }),
      );
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of airports', async () => {
      const query: AirportQueryDto = { page: 1, limit: 10, sortBy: 'name', sortOrder: 'asc' };
      const airports = [{ id: '1', name: 'Test Airport', code: 'TST', country: 'Testland', latitude: 0, longitude: 0, createdAt: new Date(), updatedAt: new Date(), servicedByAirlines: [], routesFrom: [], routesTo: [] }];
      const total = 1;
      const expectedResult = { data: airports, meta: { total, page: query.page, limit: query.limit, lastPage: 1 } };

      mockAirportsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single airport', async () => {
      const airport = { id: '1', name: 'Test Airport', code: 'TST', country: 'Testland', latitude: 0, longitude: 0, createdAt: new Date(), updatedAt: new Date(), servicedByAirlines: [], routesFrom: [], routesTo: [] };

      mockAirportsService.findOne.mockResolvedValue(airport);

      const result = await controller.findOne('1', { include: [] });

      expect(service.findOne).toHaveBeenCalledWith({ id: '1' }, { include: [] });
      expect(result).toEqual(airport);
    });

    it('should return null if the airport does not exist', async () => {
      mockAirportsService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('1', { include: [] });

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an airport', async () => {
      const updateAirportDto = { name: 'Updated Airport' };
      const airport = { id: '1', name: 'Updated Airport', code: 'TST', country: 'Testland', latitude: 0, longitude: 0, createdAt: new Date(), updatedAt: new Date(), servicedByAirlines: [], routesFrom: [], routesTo: [] };

      mockAirportsService.update.mockResolvedValue(airport);

      const result = await controller.update('1', updateAirportDto);

      expect(service.update).toHaveBeenCalledWith({ id: '1' }, updateAirportDto);
      expect(result).toEqual(airport);
    });

    it('should throw an error if the airport does not exist', async () => {
      const updateAirportDto = { name: 'Updated Airport' };

      mockAirportsService.update.mockRejectedValue(new Error('Airport not found'));

      await expect(controller.update('1', updateAirportDto)).rejects.toThrow(
        new Error('Airport not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete an airport', async () => {
      const airport = { id: '1', name: 'Test Airport', code: 'TST', country: 'Testland', latitude: 0, longitude: 0, createdAt: new Date(), updatedAt: new Date(), servicedByAirlines: [], routesFrom: [], routesTo: [] };

      mockAirportsService.remove.mockResolvedValue(airport);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(airport);
    });

    it('should throw an error if the airport does not exist', async () => {
      mockAirportsService.remove.mockRejectedValue(new Error('Airport not found'));

      await expect(controller.remove('1')).rejects.toThrow(new Error('Airport not found'));
    });
  });
});