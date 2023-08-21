import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { User } from '../users/entities/user.entity';

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

    return await this.createNewPairTokens(user);
  }

  async refresh(id: string, { refreshToken }: AuthRefreshDto) {
    const user = await this.usersService.findOneById(id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }

    return await this.createNewPairTokens(user);
  }

  async createNewPairTokens(user: User) {
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
}
