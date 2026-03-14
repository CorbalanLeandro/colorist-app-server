import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { MongooseHealthIndicator } from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';

import { Public } from '../auth/decorators';

@Controller('health')
@Public()
@SkipThrottle()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongooseHealthIndicator: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        this.mongooseHealthIndicator.pingCheck('database'),
    ]);
  }
}
