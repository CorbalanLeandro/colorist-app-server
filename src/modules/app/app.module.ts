import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import {
  ThrottlerModule,
  ThrottlerGuard,
  type ThrottlerModuleOptions,
} from '@nestjs/throttler';

import config from '../../config';
import { ENVIRONMENT } from '../../constants';
import { SheetModule } from '../sheet/sheet.module';
import { ClientModule } from '../client/client.module';
import { ColoristModule } from '../colorist/colorist.module';
import { AuthModule } from '../auth/auth.module';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import { throttlerGetTracker } from '../../common/guards';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        getTracker: throttlerGetTracker,
        skipIf: () => configService.get<string>('app.env') !== ENVIRONMENT.PROD,
        throttlers: [
          {
            limit: parseInt(
              configService.get<string>('throttle.limit', '100'),
              10,
            ),
            name: 'default',
            ttl: parseInt(
              configService.get<string>('throttle.ttl', '60000'),
              10,
            ),
          },
          {
            limit: parseInt(
              configService.get<string>('throttle.auth.limit', '5'),
              10,
            ),
            name: 'short',
            ttl: parseInt(
              configService.get<string>('throttle.auth.ttl', '60000'),
              10,
            ),
          },
        ],
      }),
    }),
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    ClientModule,
    ColoristModule,
    SheetModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
