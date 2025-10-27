
import { Test, TestingModule } from '@nestjs/testing';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { RouteQueryDto } from './routes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockRoutesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('RoutesController', () => {
  let controller: RoutesController;
  let service: RoutesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoutesController],
      providers: [
        {
          provide: RoutesService,
          useValue: mockRoutesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RoutesController>(RoutesController);
    service = module.get<RoutesService>(RoutesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a route', async () => {
      const createRouteDto = { fromAirportId: '1', toAirportId: '2', airlineId: '1' };
      const expectedRoute = { id: '1', ...createRouteDto, distanceKm: 0, createdAt: new Date(), updatedAt: new Date() };

      mockRoutesService.create.mockResolvedValue(expectedRoute);

      const result = await controller.create(createRouteDto);

      expect(service.create).toHaveBeenCalledWith(createRouteDto);
      expect(result).toEqual(expectedRoute);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of routes', async () => {
      const query: RouteQueryDto = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' };
      const routes = [{ id: '1', fromAirportId: '1', toAirportId: '2', airlineId: '1', distanceKm: 0, createdAt: new Date(), updatedAt: new Date() }];
      const total = 1;
      const expectedResult = { data: routes, meta: { total, page: query.page, limit: query.limit, lastPage: 1 } };

      mockRoutesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single route', async () => {
      const route = { id: '1', fromAirportId: '1', toAirportId: '2', airlineId: '1', distanceKm: 0, createdAt: new Date(), updatedAt: new Date() };

      mockRoutesService.findOne.mockResolvedValue(route);

      const result = await controller.findOne('1', { include: [] });

      expect(service.findOne).toHaveBeenCalledWith({ id: '1' }, { include: [] });
      expect(result).toEqual(route);
    });
  });

  describe('update', () => {
    it('should update a route', async () => {
      const updateRouteDto = { airlineId: '2' };
      const route = { id: '1', fromAirportId: '1', toAirportId: '2', airlineId: '2', distanceKm: 0, createdAt: new Date(), updatedAt: new Date() };

      mockRoutesService.update.mockResolvedValue(route);

      const result = await controller.update('1', updateRouteDto);

      expect(service.update).toHaveBeenCalledWith({ id: '1' }, updateRouteDto);
      expect(result).toEqual(route);
    });
  });

  describe('remove', () => {
    it('should delete a route', async () => {
      const route = { id: '1', fromAirportId: '1', toAirportId: '2', airlineId: '1', distanceKm: 0, createdAt: new Date(), updatedAt: new Date() };

      mockRoutesService.remove.mockResolvedValue(route);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(route);
    });
  });
});
