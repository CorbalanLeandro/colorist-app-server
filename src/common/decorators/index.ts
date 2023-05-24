import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsMongoId,
  IsObject,
  IsOptional,
  ValidateNested,
  ValidationOptions,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
  ICustomApiPropertyDto,
  ICustomApiPropertyRequired,
} from '../interfaces';

export const ApiPropertyColoristId = ({
  required = true,
}: ICustomApiPropertyRequired = {}): ReturnType<typeof applyDecorators> => {
  const validatorDecorators: PropertyDecorator[] = [];

  if (!required) {
    validatorDecorators.push(IsOptional());
  }

  validatorDecorators.push(IsMongoId());

  return applyDecorators(
    ApiProperty({
      description:
        'coloristId attribute, used to link the document to a colorist',
      example: '6193e45824ec040624af509d',
      required,
      type: String,
    }),
    ...validatorDecorators,
  );
};

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
