import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length, Matches } from 'class-validator';

import { IHairServiceIngredient } from '../interfaces';

import {
  HAIR_SERVICE_INGREDIENT_BRAND_LENGTH,
  HAIR_SERVICE_INGREDIENT_HEIGHT_LENGTH,
  HAIR_SERVICE_INGREDIENT_QUANTITY_LENGTH,
  HAIR_SERVICE_INGREDIENT_TONE_LENGTH,
  OXIDIZING_REGEX_VALIDATION,
  OXIDIZING_VALIDATION_ERROR_MESSAGE,
} from '../constants';

export class HairServiceIngredientsDto implements IHairServiceIngredient {
  @ApiProperty({
    description: 'Ingredient brand.',
    example: 'Schwarzkopf Professional',
    maxLength: HAIR_SERVICE_INGREDIENT_BRAND_LENGTH.MAX,
    minLength: HAIR_SERVICE_INGREDIENT_BRAND_LENGTH.MIN,
  })
  @Length(
    HAIR_SERVICE_INGREDIENT_BRAND_LENGTH.MIN,
    HAIR_SERVICE_INGREDIENT_BRAND_LENGTH.MAX,
  )
  brand: string;

  @ApiPropertyOptional({
    description: 'Ingredient height.',
    example: '9',
    maxLength: HAIR_SERVICE_INGREDIENT_HEIGHT_LENGTH.MAX,
    minLength: HAIR_SERVICE_INGREDIENT_HEIGHT_LENGTH.MIN,
    nullable: true,
  })
  @IsOptional()
  @Length(
    HAIR_SERVICE_INGREDIENT_HEIGHT_LENGTH.MIN,
    HAIR_SERVICE_INGREDIENT_HEIGHT_LENGTH.MAX,
  )
  height: string;

  @ApiProperty({
    description: 'Ingredient oxidizing percentage.',
    example: '15.5',
    pattern: `${OXIDIZING_REGEX_VALIDATION}`,
  })
  @Matches(OXIDIZING_REGEX_VALIDATION, {
    message: OXIDIZING_VALIDATION_ERROR_MESSAGE,
  })
  oxidizing: string;

  @ApiProperty({
    description: 'Ingredient quantity. (grams)',
    example: '100',
    maxLength: HAIR_SERVICE_INGREDIENT_QUANTITY_LENGTH.MAX,
    minLength: HAIR_SERVICE_INGREDIENT_QUANTITY_LENGTH.MIN,
  })
  @Length(
    HAIR_SERVICE_INGREDIENT_QUANTITY_LENGTH.MIN,
    HAIR_SERVICE_INGREDIENT_QUANTITY_LENGTH.MAX,
  )
  quantity: string;

  @ApiProperty({
    description: 'Ingredient tone.',
    example: '7-22',
    maxLength: HAIR_SERVICE_INGREDIENT_TONE_LENGTH.MAX,
    minLength: HAIR_SERVICE_INGREDIENT_TONE_LENGTH.MIN,
  })
  @Length(
    HAIR_SERVICE_INGREDIENT_TONE_LENGTH.MIN,
    HAIR_SERVICE_INGREDIENT_TONE_LENGTH.MAX,
  )
  tone: string;
}
