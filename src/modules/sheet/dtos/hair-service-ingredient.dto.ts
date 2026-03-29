import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

import { IHairServiceIngredient } from '../interfaces';

import {
  HAIR_SERVICE_INGREDIENT_BRAND_LENGTH,
  HAIR_SERVICE_INGREDIENT_QUANTITY_LENGTH,
  HAIR_SERVICE_INGREDIENT_TONE_LENGTH,
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
