import { Test, TestingModule } from '@nestjs/testing';
import { RoutesService } from './routes.service';
import { DatabaseService } from '../database/database.service';
import { RouteQueryDto } from './routes.dto';

const mockDatabaseService = {
  route: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  airport: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('RoutesService', () => {
  let service: RoutesService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<RoutesService>(RoutesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a route', async () => {
      const createRouteDto = { fromAirportId: '1', toAirportId: '2', airlineId: '1' };
      const expectedRoute = { id: '1', ...createRouteDto, distanceKm: null, createdAt: new Date(), updatedAt: new Date() };

      mockDatabaseService.route.create.mockResolvedValue(expectedRoute);
      mockDatabaseService.airport.findUnique.mockResolvedValue({ id: '1', latitude: 0, longitude: 0 });

      const result = await service.create(createRouteDto);

      expect(databaseService.route.create).toHaveBeenCalledWith({
        data: { ...createRouteDto, distanceKm: 0 },
      });
      expect(result).toEqual(expectedRoute);
    });

    it('should throw an error if the fromAirportId or toAirportId does not exist', async () => {
      const createRouteDto = { fromAirportId: '1', toAirportId: '2', airlineId: '1' };

      mockDatabaseService.airport.findUnique.mockResolvedValue(null);

      await expect(service.create(createRouteDto)).rejects.toThrow(
        new Error('Could not find one or both airports'),
      );
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of routes', async () => {
      const query: RouteQueryDto = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      const routes = [{ id: '1', fromAirportId: '1', toAirportId: '2', airlineId: '1', distanceKm: null, createdAt: new Date(), updatedAt: new Date() }];
      const total = 1;

      mockDatabaseService.$transaction.mockResolvedValue([routes, total]);

      const result = await service.findAll(query);

      expect(databaseService.$transaction).toHaveBeenCalled();
      expect(result).toEqual({
        data: routes,
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
    it('should return a single route', async () => {
      const route = { id: '1', fromAirportId: '1', toAirportId: '2', airlineId: '1', distanceKm: null, createdAt: new Date(), updatedAt: new Date() };
      mockDatabaseService.route.findUnique.mockResolvedValue(route);
      mockDatabaseService.airport.findUnique.mockResolvedValue({ id: '1', latitude: 0, longitude: 0 });

      const result = await service.findOne({ id: '1' }, { include: ['fromAirport', 'toAirport', 'airline'] });

      expect(databaseService.route.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { fromAirport: true, toAirport: true, airline: true },
      });
      expect(result).toEqual(route);
    });

    it('should return null if the route does not exist', async () => {
      mockDatabaseService.route.findUnique.mockResolvedValue(null);

      const result = await service.findOne({ id: '1' }, { include: [] });

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a route', async () => {
      const updateRouteDto = { airlineId: '2' };
      const route = { id: '1', fromAirportId: '1', toAirportId: '2', airlineId: '2', distanceKm: null, createdAt: new Date(), updatedAt: new Date() };
      mockDatabaseService.route.findUnique.mockResolvedValue({ id: '1', fromAirportId: '1', toAirportId: '2', airlineId: '1', distanceKm: null, createdAt: new Date(), updatedAt: new Date() });
      mockDatabaseService.route.update.mockResolvedValue(route);
      mockDatabaseService.airport.findUnique.mockResolvedValue({ id: '1', latitude: 0, longitude: 0 });

      const result = await service.update({ id: '1' }, updateRouteDto);

      expect(databaseService.route.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { ...updateRouteDto, distanceKm: 0 },
      });
      expect(result).toEqual(route);
    });

    it('should throw an error if the route does not exist', async () => {
      const updateRouteDto = { airlineId: '2' };

      mockDatabaseService.route.update.mockRejectedValue(new Error('Route not found'));

      await expect(service.update({ id: '1' }, updateRouteDto)).rejects.toThrow(
        new Error('Route not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a route', async () => {
      const route = { id: '1', fromAirportId: '1', toAirportId: '2', airlineId: '1', distanceKm: null, createdAt: new Date(), updatedAt: new Date() };
      mockDatabaseService.route.delete.mockResolvedValue(route);

      const result = await service.remove({ id: '1' });

      expect(databaseService.route.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(route);
    });

    it('should throw an error if the route does not exist', async () => {
      mockDatabaseService.route.delete.mockRejectedValue(new Error('Route not found'));

      await expect(service.remove({ id: '1' })).rejects.toThrow(new Error('Route not found'));
    });
  });
});