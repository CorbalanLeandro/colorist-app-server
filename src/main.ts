import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { AppModule } from './modules/app/app.module';
import { APP_GLOBAL_PREFIX } from './constants';
import { UseSwagger } from './swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(APP_GLOBAL_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );

  app.use(helmet());
  app.enableCors();

  const appConfig = await app.resolve(ConfigService);
  const port = appConfig.getOrThrow<number>('app.port');
  const env = appConfig.getOrThrow<string>('app.env');

  UseSwagger(app, env, port);

  await app.listen(port);

  Logger.log(
    `Server is running on: http://localhost:${port}/${APP_GLOBAL_PREFIX}`,
  );
}

bootstrap();
