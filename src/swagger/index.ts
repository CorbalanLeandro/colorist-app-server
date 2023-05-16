import { INestApplication, Logger } from '@nestjs/common';

import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { ENVIRONMENT, SWAGGER_DOCS_PREFIX } from '../constants';

export const UseSwagger = (
  app: INestApplication,
  env: string,
  port: number,
) => {
  if (env === ENVIRONMENT.PROD) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Colorist App.')
    .setDescription('Colorist App server.')
    .addBearerAuth()
    .build();

  const options: SwaggerCustomOptions = {
    customSiteTitle: 'Colorist App | API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_DOCS_PREFIX, app, document, options);

  Logger.log(
    `Swagger docs on: http://localhost:${port}/${SWAGGER_DOCS_PREFIX}`,
  );
};
