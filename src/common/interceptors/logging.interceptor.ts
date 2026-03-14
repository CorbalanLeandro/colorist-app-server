import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  private readonly SENSITIVE_HEADERS = [
    'authorization',
    'cookie',
    'set-cookie',
    'x-api-key',
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const reqBody = request.body;
    const reqHeaders = this.sanitizeHeaders(request.headers);
    const queryParams = request.query;
    const method = request.method;
    const path = request.url;
    const referer = request.headers.referer;
    const userId = request.coloristId;
    const userEmail = request.coloristEmail;
    const userUsername = request.coloristUsername;

    let resBody: unknown;

    response.on('close', () => {
      const responseTime = Date.now() - startTime;
      const statusCode = response.statusCode;
      const timestamp = new Date().toISOString();
      const isError = statusCode >= 400;
      const logMessage = `[${timestamp}] ${method} ${path}`;

      const logFn = isError
        ? this.logger.error.bind(this.logger)
        : this.logger.log.bind(this.logger);

      const metadata: Record<string, any> = {
        http: {
          method,
          path,
          statusCode,
        },
        req: {
          body: reqBody,
          headers: reqHeaders,
          queryParams,
          referer,
        },
        res: {
          body: resBody,
          headers: this.sanitizeHeaders(response.getHeaders()),
        },
        timing: {
          responseTimeMs: responseTime,
        },
        user: {
          email: userEmail,
          id: userId,
          username: userUsername,
        },
      };

      logFn(logMessage, metadata);
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          resBody = data;
        },
      }),
    );
  }

  private sanitizeHeaders(
    headers: Record<string, string>,
  ): Record<string, string> {
    const sanitized: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (!this.SENSITIVE_HEADERS.includes(key.toLowerCase())) {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
}
