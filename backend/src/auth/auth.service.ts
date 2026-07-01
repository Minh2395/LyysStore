import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { UsersService } from '../modules/users/users.service';
import { comparePasswordHelper } from '../helpers/util';
import { JwtService } from '@nestjs/jwt';

import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // ======================
  // VALIDATE USER (LOCAL STRATEGY)
  // ======================
  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.password) {
      throw new UnauthorizedException('Missing password in DB query');
    }

    const isValidPassword = await comparePasswordHelper(pass, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Wrong password');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account not active');
    }

    return user;
  }

  // ======================
  // LOGIN
  // ======================
  async login(user: any) {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  // ======================
  // REGISTER
  // ======================
  async register(registerDto: CreateAuthDto) {
    return this.usersService.handleRegister(registerDto);
  }

  // ======================
  // VERIFY CODE
  // ======================
  async checkCode(data: CodeAuthDto) {
    return this.usersService.handleActive(data);
  }

  // ======================
  // RESEND ACTIVATION CODE
  // ======================
  async retryActive(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    return this.usersService.retryActive(email);
  }

  // ======================
  // RESET PASSWORD FLOW
  // ======================
  async retryPassword(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    return this.usersService.retryPassword(email);
  }

  // ======================
  // CHANGE PASSWORD
  // ======================
  async changePassword(data: ChangePasswordAuthDto) {
    return this.usersService.changePassword(data);
  }
}
