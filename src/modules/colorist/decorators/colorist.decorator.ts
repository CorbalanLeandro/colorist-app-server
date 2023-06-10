import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

import { COLORIST_PASSWORD_LENGTH } from '../constants';

export const ApiPropertyColoristPassword = (): ReturnType<
  typeof applyDecorators
> => {
  return applyDecorators(
    ApiProperty({
      description: 'password attribute',
      example: 'r3@llyg00Dpasswo0rd',
      maxLength: COLORIST_PASSWORD_LENGTH.MAX,
      minLength: COLORIST_PASSWORD_LENGTH.MIN,
      type: String,
    }),
    Length(COLORIST_PASSWORD_LENGTH.MIN, COLORIST_PASSWORD_LENGTH.MAX),
  );
};
