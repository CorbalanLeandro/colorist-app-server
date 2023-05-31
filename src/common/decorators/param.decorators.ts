import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

import { Request } from 'express';
import { ApiParam } from '@nestjs/swagger';
import { isMongoId } from 'class-validator';

import { PARAM_ID } from '../constants';

export const ApiMongoIdParam = (name = PARAM_ID): MethodDecorator =>
  ApiParam({
    description: 'Mongo Document _id',
    example: '627f2a3380912eba4cb481cd',
    name,
  });

export const ParamMongoId = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const mongoIdParam = ctx.switchToHttp().getRequest<Request>().params[data];

    if (isMongoId(mongoIdParam)) {
      return mongoIdParam;
    }

    throw new BadRequestException(
      'Invalid id',
      `The value "${mongoIdParam}" is not a valid id`,
    );
  },
);
