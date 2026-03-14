import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import {
  IS_PUBLIC_KEY,
  JWT_ERROR_NAME,
  TOKEN_EXPIRED_ERROR_NAME,
} from './constants';

import { IJWTPayload } from './interfaces';
import { ColoristService } from '../colorist/colorist.service';

declare module 'express' {
  interface Request {
    coloristEmail: string;
    coloristId: string;
    coloristUsername: string;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly coloristService: ColoristService,
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

      const colorist = await this.coloristService.findOne(
        { _id: payload.sub },
        { jwtVersion: 1 },
      );

      if (payload.jwtVersion !== colorist.jwtVersion) {
        return false;
      }

      request['coloristId'] = payload.sub;
      request['coloristEmail'] = payload.email;
      request['coloristUsername'] = payload.username;
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
