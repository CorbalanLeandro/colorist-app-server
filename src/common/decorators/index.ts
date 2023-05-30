import {
  BadRequestException,
  ExecutionContext,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';

import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';

import {
  IsArray,
  IsMongoId,
  IsObject,
  IsOptional,
  ValidateNested,
  ValidationOptions,
  isMongoId,
} from 'class-validator';

import { Request } from 'express';
import { Type } from 'class-transformer';

import {
  IClass,
  ICustomApiPropertyDto,
  ICustomMongoApiProperty,
} from '../interfaces';

import { PARAM_ID } from '../constants';
import { ResultResponseDto } from '../dtos';

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

export const ApiOperationCreate = (
  createdDto: IClass,
): ReturnType<typeof applyDecorators> =>
  applyDecorators(
    ApiOperation({
      description: 'Creates a document and returns it.',
      summary: 'Creates a document.',
    }),
    ApiCreatedResponse({
      description: 'Created document.',
      type: createdDto,
    }),
  );

export const ApiOperationFindAll = (
  foundDto: IClass,
  operationDescription: string,
): ReturnType<typeof applyDecorators> =>
  applyDecorators(
    ApiOperation({
      description: operationDescription,
      summary: 'Finds the documents.',
    }),
    ApiOkResponse({
      description: 'All documents that meet the filter criteria.',
      isArray: true,
      type: foundDto,
    }),
  );

export const ApiOperationFindOneById = (
  foundDto: IClass,
): ReturnType<typeof applyDecorators> =>
  applyDecorators(
    ApiOperation({
      description: 'Finds a document by id and returns it.',
      summary: 'Finds a document.',
    }),
    ApiOkResponse({
      description: 'The document found.',
      type: foundDto,
    }),
  );

export const ApiOperationUpdateOneById = (): ReturnType<
  typeof applyDecorators
> =>
  applyDecorators(
    ApiOperation({
      description: 'Updates a document by id.',
      summary: 'Updates a document.',
    }),
    ApiOkResponse({
      description: 'Result response indicating all went fine.',
      type: ResultResponseDto,
    }),
  );

export const ApiOperationDeleteOneById = (): ReturnType<
  typeof applyDecorators
> =>
  applyDecorators(
    ApiOperation({
      description: 'Deletes a document by id.',
      summary: 'Deletes a document.',
    }),
    ApiOkResponse({
      description: 'Result response indicating all went fine.',
      type: ResultResponseDto,
    }),
  );

export const ApiPropertyDto = ({
  isArray = false,
  required = true,
  dto,
}: ICustomApiPropertyDto): ReturnType<typeof applyDecorators> => {
  let validatorOptions: ValidationOptions | undefined;

  const validatorDecorators: PropertyDecorator[] = [];

  if (!required) {
    validatorDecorators.push(IsOptional());
  }

  if (isArray) {
    validatorDecorators.push(IsArray());
    validatorOptions = { each: true };
  }

  validatorDecorators.push(
    IsObject(validatorOptions),
    ValidateNested(validatorOptions),
    Type(() => dto),
  );

  return applyDecorators(
    ApiProperty({
      description: `${dto.name || 'dto'} attribute`,
      isArray,
      required,
      type: dto,
    }),
    ...validatorDecorators,
  );
};

export const ApiPropertyMongoId = ({
  isArray = false,
  required = true,
  referenceName,
}: ICustomMongoApiProperty = {}): ReturnType<typeof applyDecorators> => {
  let validatorOptions: ValidationOptions | undefined;

  const validatorDecorators: PropertyDecorator[] = [];

  if (!required) {
    validatorDecorators.push(IsOptional());
  }

  if (isArray) {
    validatorDecorators.push(IsArray());
    validatorOptions = { each: true };
  }

  validatorDecorators.push(IsMongoId(validatorOptions));

  const example = '5fda1492bbf9cb1bc4c4ed5c';

  return applyDecorators(
    ApiProperty({
      description: `${referenceName} id attribute`,
      example: isArray ? [example, example] : example,
      isArray,
      required,
      type: String,
    }),
    ...validatorDecorators,
  );
};
