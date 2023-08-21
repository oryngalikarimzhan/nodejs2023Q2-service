import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

import { Public } from './decorators/public';
import { AuthService } from './auth.service';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body(ValidationPipe) dto: AuthSignupDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('login')
  login(@Body(ValidationPipe) dto: AuthLoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body(ValidationPipe) dto: AuthRefreshDto) {
    return this.authService.refresh(dto);
  }
}
