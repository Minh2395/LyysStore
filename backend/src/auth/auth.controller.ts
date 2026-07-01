import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';

import { Public, ResponseMessage } from '../decorator/customize';

import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';

import { EmailDto } from '../auth/dto/email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ======================
  // LOGIN
  // ======================
  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login successfully')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  // ======================
  // REGISTER
  // ======================
  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }

  // ======================
  // VERIFY CODE
  // ======================
  @Post('check-code')
  @Public()
  checkCode(@Body() dto: CodeAuthDto) {
    return this.authService.checkCode(dto);
  }

  // ======================
  // RESEND ACTIVATION
  // ======================
  @Post('retry-active')
  @Public()
  retryActive(@Body() dto: EmailDto) {
    return this.authService.retryActive(dto.email);
  }

  // ======================
  // RESET PASSWORD
  // ======================
  @Post('retry-password')
  @Public()
  retryPassword(@Body() dto: EmailDto) {
    return this.authService.retryPassword(dto.email);
  }

  // ======================
  // CHANGE PASSWORD
  // ======================
  @Post('change-password')
  @Public()
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authService.changePassword(data);
  }
}
