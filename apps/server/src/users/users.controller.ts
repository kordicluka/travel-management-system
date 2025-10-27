import { Controller, Get, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateUserDto } from './users.dto';
import { UserPublic } from '@travel-management-system/schemas';

@UseGuards(JwtAuthGuard) // Protect all routes in this controller
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // A common pattern is /users/me to get/update your own profile
  @Patch('me')
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPublic> {
    const updatedUser = await this.userService.update({
      where: { id: userId },
      data: updateUserDto,
    });

    const { password, refreshToken, ...result } = updatedUser;
    return result;
  }
}
