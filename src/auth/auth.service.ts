import { ForbiddenException, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: AuthSignupDto) {
    return this.usersService.create(dto);
  }

  async login({ login, password }: AuthLoginDto) {
    const user = await this.usersService.findOneByLogin(login);

    if (!user || !(await compare(password, user.password))) {
      throw new ForbiddenException('login or password is incorrect');
    }

    const payload = { id: user.id, login: user.login };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: this.configService.get('TOKEN_EXPIRE_TIME'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
        expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME'),
      }),
    ]);

    this.usersService.updateRefreshToken(user, refreshToken);

    return { accessToken, refreshToken };
  }

  async refresh(dto: AuthRefreshDto) {
    console.log(dto);
  }
}
