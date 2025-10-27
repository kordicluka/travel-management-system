import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  refreshToken: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(JwtRefreshGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      const registerDto = { email: 'test@test.com', password: 'password' };
      const user = { id: '1', email: 'test@test.com', password: 'hashedpassword', refreshToken: null, createdAt: new Date(), updatedAt: new Date() };
      const tokens = { accessToken: 'at', refreshToken: 'rt' };

      mockAuthService.register.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(tokens);

      const result = await controller.register(registerDto);

      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(service.login).toHaveBeenCalledWith({ id: '1', email: 'test@test.com', createdAt: user.createdAt, updatedAt: user.updatedAt });
      expect(result).toEqual(tokens);
    });
  });

  describe('login', () => {
    it('should login a user and return tokens', async () => {
      const loginDto = { email: 'test@test.com', password: 'password' };
      const user = { id: '1', email: 'test@test.com' };
      const tokens = { accessToken: 'at', refreshToken: 'rt' };

      mockAuthService.login.mockResolvedValue(tokens);

      const result = await controller.login(loginDto, user as any);

      expect(service.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(tokens);
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      mockAuthService.logout.mockResolvedValue(true);

      const result = await controller.logout('1');

      expect(service.logout).toHaveBeenCalledWith('1');
      expect(result).toEqual(true);
    });
  });

  describe('refreshToken', () => {
    it('should refresh the tokens', async () => {
      const user = { id: '1', email: 'test@test.com' };
      const tokens = { accessToken: 'at', refreshToken: 'rt' };

      mockAuthService.refreshToken.mockResolvedValue(tokens);

      const result = await controller.refreshToken(user as any);

      expect(service.refreshToken).toHaveBeenCalledWith(user);
      expect(result).toEqual(tokens);
    });
  });
});