import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockUsersService = {
  update: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should update the user profile', async () => {
      const userId = '1';
      const updateUserDto = { email: 'updated@test.com' };
      const updatedUser = { id: userId, email: 'updated@test.com', password: 'hashedpassword', refreshToken: null, createdAt: new Date(), updatedAt: new Date() };
      const expectedResult = { id: userId, email: 'updated@test.com', createdAt: updatedUser.createdAt, updatedAt: updatedUser.updatedAt };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(userId, updateUserDto);

      expect(service.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserDto,
      });
      expect(result).toEqual(expectedResult);
    });
  });
});