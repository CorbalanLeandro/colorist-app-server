import { applyDecorators } from '@nestjs/common';

import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { ResultResponseDto } from '../dtos';
import { IClass } from '../interfaces';

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
