import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  RegisterInput,
  UserPublic,
  Tokens,
} from '@travel-management-system/schemas';
import * as bcrypt from 'bcrypt';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserPublic | null> {
    const user = await this.userService.findOne({ email });

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, refreshToken, ...result } = user;
      return result; // result is of type UserPublic
    }
    return null;
  }

  async register(registerInput: RegisterInput) {
    return this.userService.create(registerInput);
  }

  async login(user: UserPublic): Promise<Tokens> {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    const tokens = await this.generateTokens(payload);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }

  /**
   * Used by AuthController to log out. Invalidates refresh token.
   */
  async logout(userId: string): Promise<boolean> {
    await this.userService.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return true;
  }

  async refreshToken(user: UserPublic): Promise<Tokens> {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    const tokens = await this.generateTokens(payload);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }

  private async generateTokens(payload: JwtPayload): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  private async updateRefreshTokenHash(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.userService.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }
}
