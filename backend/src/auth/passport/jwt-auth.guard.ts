import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (err || !user) {
      const message = this.getErrorMessage(info);

      throw new UnauthorizedException(message);
    }

    return user;
  }

  private getErrorMessage(info: any): string {
    if (!info) return 'Access Token không hợp lệ';

    switch (info.name) {
      case 'TokenExpiredError':
        return 'Access Token đã hết hạn';

      case 'JsonWebTokenError':
        return 'Access Token không hợp lệ';

      case 'NotBeforeError':
        return 'Token chưa có hiệu lực';

      default:
        return 'Unauthorized';
    }
  }
}
