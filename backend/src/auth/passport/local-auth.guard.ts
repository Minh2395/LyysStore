import { Injectable, ExecutionContext, Logger } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    this.logger.debug(`Local login attempt: ${request.body?.email}`);

    // future: rate limit hook / captcha check
    return (await super.canActivate(context)) as boolean;
  }
}
