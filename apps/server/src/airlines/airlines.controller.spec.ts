
import { Test, TestingModule } from '@nestjs/testing';
import { AirlinesController } from './airlines.controller';
import { AirlinesService } from './airlines.service';
import { AirlineQueryDto } from './airlines.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockAirlinesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('AirlinesController', () => {
  let controller: AirlinesController;
  let service: AirlinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirlinesController],
      providers: [
        {
          provide: AirlinesService,
          useValue: mockAirlinesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AirlinesController>(AirlinesController);
    service = module.get<AirlinesService>(AirlinesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an airline', async () => {
      const createAirlineDto = { name: 'Test Airline', baseCountry: 'Testland', servicedAirportIds: ['1'] };
      const expectedAirline = { id: '1', ...createAirlineDto, createdAt: new Date(), updatedAt: new Date(), servicedAirports: [], operatedRoutes: [] };

      mockAirlinesService.create.mockResolvedValue(expectedAirline);

      const result = await controller.create(createAirlineDto);

      expect(service.create).toHaveBeenCalledWith(createAirlineDto);
      expect(result).toEqual(expectedAirline);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of airlines', async () => {
      const query: AirlineQueryDto = { page: 1, limit: 10, sortBy: 'name', sortOrder: 'asc' };
      const airlines = [{ id: '1', name: 'Test Airline', baseCountry: 'Testland', createdAt: new Date(), updatedAt: new Date(), servicedAirports: [], operatedRoutes: [] }];
      const total = 1;
      const expectedResult = { data: airlines, meta: { total, page: query.page, limit: query.limit, lastPage: 1 } };

      mockAirlinesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single airline', async () => {
      const airline = { id: '1', name: 'Test Airline', baseCountry: 'Testland', createdAt: new Date(), updatedAt: new Date(), servicedAirports: [], operatedRoutes: [] };

      mockAirlinesService.findOne.mockResolvedValue(airline);

      const result = await controller.findOne('1', { include: [] });

      expect(service.findOne).toHaveBeenCalledWith({ id: '1' }, { include: [] });
      expect(result).toEqual(airline);
    });
  });

  describe('update', () => {
    it('should update an airline', async () => {
      const updateAirlineDto = { name: 'Updated Airline' };
      const airline = { id: '1', name: 'Updated Airline', baseCountry: 'Testland', createdAt: new Date(), updatedAt: new Date(), servicedAirports: [], operatedRoutes: [] };

      mockAirlinesService.update.mockResolvedValue(airline);

      const result = await controller.update('1', updateAirlineDto);

      expect(service.update).toHaveBeenCalledWith({ id: '1' }, updateAirlineDto);
      expect(result).toEqual(airline);
    });
  });

  describe('remove', () => {
    it('should delete an airline', async () => {
      const airline = { id: '1', name: 'Test Airline', baseCountry: 'Testland', createdAt: new Date(), updatedAt: new Date(), servicedAirports: [], operatedRoutes: [] };

      mockAirlinesService.remove.mockResolvedValue(airline);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(airline);
    });
  });
});
