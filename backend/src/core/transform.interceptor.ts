import { RESPONSE_MESSAGE } from '../decorator/customize';

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  statusCode: number;
  message: string | null;
  data: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) ||
      null;

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        message,
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}
