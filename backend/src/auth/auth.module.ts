import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsersModule } from '../modules/users/users.module';

import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { LocalStrategy } from './passport/local_strategy';
import { JwtStrategy } from './passport/jwt.strategy';

import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule,

    UsersModule,

    // ⚠️ Don't force jwt as default unless all routes use jwt guard
    PassportModule.register({
      session: false,
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>('JWT_ACCESS_TOKEN_SECRET');

        if (!secret) {
          throw new Error('JWT_ACCESS_TOKEN_SECRET is not defined');
        }

        return {
          secret,
          signOptions: {
            expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ??
              '1h') as any,
          },
        };
      },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
