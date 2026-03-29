import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length, Matches } from 'class-validator';

import { ApiPropertyDto } from '../../../common';
import { IHairService, IHairServiceIngredient } from '../interfaces';
import { HairServiceIngredientsDto } from './hair-service-ingredient.dto';

import {
  HAIR_SERVICE_HEIGHT_LENGTH,
  HAIR_SERVICE_NAME_LENGTH,
  HAIR_SERVICE_OBSERVATIONS_LENGTH,
  OXIDIZING_REGEX_VALIDATION,
  OXIDIZING_VALIDATION_ERROR_MESSAGE,
} from '../constants';

export class HairServiceDto implements IHairService {
  @ApiPropertyOptional({
    description: 'Hair service height.',
    example: '9',
    maxLength: HAIR_SERVICE_HEIGHT_LENGTH.MAX,
    minLength: HAIR_SERVICE_HEIGHT_LENGTH.MIN,
    nullable: true,
  })
  @IsOptional()
  @Length(HAIR_SERVICE_HEIGHT_LENGTH.MIN, HAIR_SERVICE_HEIGHT_LENGTH.MAX)
  height?: string;

  @ApiPropertyDto({ dto: HairServiceIngredientsDto, isArray: true })
  ingredients: IHairServiceIngredient[];

  @ApiProperty({
    description: 'Hair service name.',
    example: 'Balayage',
    maxLength: HAIR_SERVICE_NAME_LENGTH.MAX,
    minLength: HAIR_SERVICE_NAME_LENGTH.MIN,
  })
  @Length(HAIR_SERVICE_NAME_LENGTH.MIN, HAIR_SERVICE_NAME_LENGTH.MAX)
  name: string;

  @ApiPropertyOptional({
    description: 'Hair service observations.',
    example: 'The hair is damage, use less oxidizing next time.',
    maxLength: HAIR_SERVICE_OBSERVATIONS_LENGTH.MAX,
    minLength: HAIR_SERVICE_OBSERVATIONS_LENGTH.MIN,
    nullable: true,
  })
  @IsOptional()
  @Length(
    HAIR_SERVICE_OBSERVATIONS_LENGTH.MIN,
    HAIR_SERVICE_OBSERVATIONS_LENGTH.MAX,
  )
  observations?: string;

  @ApiProperty({
    description: 'Hair service oxidizing percentage.',
    example: '15.5',
    pattern: `${OXIDIZING_REGEX_VALIDATION}`,
  })
  @Matches(OXIDIZING_REGEX_VALIDATION, {
    message: OXIDIZING_VALIDATION_ERROR_MESSAGE,
  })
  oxidizing: string;
}
