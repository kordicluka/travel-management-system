import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma, User } from '@travel-management-system/database';
import { RegisterInput, UpdateUser } from '@travel-management-system/schemas';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.databaseService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.databaseService.user.findUnique({ where });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUser;
  }): Promise<User> {
    return this.databaseService.user.update(params);
  }
}
