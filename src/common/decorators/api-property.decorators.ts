import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  ValidationOptions,
  IsOptional,
  IsArray,
  IsObject,
  ValidateNested,
  IsMongoId,
  IsEmail,
  Length,
} from 'class-validator';

import {
  ATTRIBUTE_EMAIL_LENGTH,
  ATTRIBUTE_LAST_NAME_LENGTH,
  ATTRIBUTE_NAME_LENGTH,
  ATTRIBUTE_PHONE_NUMBER_LENGTH,
} from '../constants';

import {
  ICustomApiPropertyDto,
  ICustomMongoApiProperty,
  IRequired,
  ICustomApiProperty,
} from '../interfaces';

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
}: ICustomMongoApiProperty): ReturnType<typeof applyDecorators> => {
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

export const ApiPropertyEmail = ({
  required = true,
}: IRequired = {}): ReturnType<typeof applyDecorators> => {
  const validatorDecorators: PropertyDecorator[] = [];

  if (!required) {
    validatorDecorators.push(IsOptional());
  }

  validatorDecorators.push(
    IsEmail(),
    Length(ATTRIBUTE_EMAIL_LENGTH.MIN, ATTRIBUTE_EMAIL_LENGTH.MAX),
  );

  return applyDecorators(
    ApiProperty({
      description: 'email attribute',
      example: 'example@domain.com',
      maxLength: ATTRIBUTE_EMAIL_LENGTH.MAX,
      minLength: ATTRIBUTE_EMAIL_LENGTH.MIN,
      required,
      type: String,
    }),
    ...validatorDecorators,
  );
};

export const ApiPropertyLastName = ({
  example = 'Doe',
  required = true,
}: Omit<ICustomApiProperty, 'description' | 'isArray'> = {}): ReturnType<
  typeof applyDecorators
> => {
  const validatorDecorators: PropertyDecorator[] = [];

  if (!required) {
    validatorDecorators.push(IsOptional());
  }

  validatorDecorators.push(
    Length(ATTRIBUTE_LAST_NAME_LENGTH.MIN, ATTRIBUTE_LAST_NAME_LENGTH.MAX),
  );

  return applyDecorators(
    ApiProperty({
      description: 'last name attribute',
      example,
      maxLength: ATTRIBUTE_LAST_NAME_LENGTH.MAX,
      minLength: ATTRIBUTE_LAST_NAME_LENGTH.MIN,
      required,
      type: String,
    }),
    ...validatorDecorators,
  );
};

export const ApiPropertyName = ({
  example = 'John',
  required = true,
}: Omit<ICustomApiProperty, 'description' | 'isArray'> = {}): ReturnType<
  typeof applyDecorators
> => {
  const validatorDecorators: PropertyDecorator[] = [];

  if (!required) {
    validatorDecorators.push(IsOptional());
  }

  validatorDecorators.push(
    Length(ATTRIBUTE_NAME_LENGTH.MIN, ATTRIBUTE_NAME_LENGTH.MAX),
  );

  return applyDecorators(
    ApiProperty({
      description: 'name attribute',
      example,
      maxLength: ATTRIBUTE_NAME_LENGTH.MAX,
      minLength: ATTRIBUTE_NAME_LENGTH.MIN,
      required,
      type: String,
    }),
    ...validatorDecorators,
  );
};

export const ApiPropertyPhoneNumber = ({
  required = true,
}: IRequired = {}): ReturnType<typeof applyDecorators> => {
  const validatorDecorators: PropertyDecorator[] = [];

  if (!required) {
    validatorDecorators.push(IsOptional());
  }

  validatorDecorators.push(
    Length(
      ATTRIBUTE_PHONE_NUMBER_LENGTH.MIN,
      ATTRIBUTE_PHONE_NUMBER_LENGTH.MAX,
    ),
  );

  return applyDecorators(
    ApiProperty({
      description: 'phone number attribute',
      example: '+5491177665544',
      maxLength: ATTRIBUTE_PHONE_NUMBER_LENGTH.MAX,
      minLength: ATTRIBUTE_PHONE_NUMBER_LENGTH.MIN,
      required,
      type: String,
    }),
    ...validatorDecorators,
  );
};
