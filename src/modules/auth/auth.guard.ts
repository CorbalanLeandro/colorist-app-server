import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import {
  IS_PUBLIC_KEY,
  JWT_ERROR_NAME,
  TOKEN_EXPIRED_ERROR_NAME,
} from './constants';

import { IJWTPayload } from './interfaces';

declare module 'express' {
  interface Request {
    coloristId: string;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync<IJWTPayload>(token);

      // 💡 We're assigning the payload.sub to the request object here
      // so that we can access it in our route handlers
      request['coloristId'] = payload.sub;
    } catch (error: any) {
      // only log unexpected errors
      if (
        error.name !== JWT_ERROR_NAME &&
        error.name !== TOKEN_EXPIRED_ERROR_NAME
      ) {
        this.logger.error('Unexpected error while authenticating request.', {
          error,
        });
      }

      return false;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
