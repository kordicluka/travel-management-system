import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@travel-management-system/database';

type AuthedUser = Omit<User, 'password' | 'refreshToken'>;

export const GetUser = createParamDecorator(
  (data: keyof AuthedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user as AuthedUser;
  },
);
