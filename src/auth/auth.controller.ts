import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
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
  refresh(@Req() req, @Body(ValidationPipe) dto: AuthRefreshDto) {
    const { id } = req.user;
    return this.authService.refresh(id, dto);
  }
}
