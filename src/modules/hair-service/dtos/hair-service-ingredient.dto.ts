import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, Length, Max, Min } from 'class-validator';

import {
  ICreateHairServiceIngredient,
  IHairServiceIngredient,
} from '../interfaces';

import {
  HAIR_SERVICE_INGREDIENT_BRAND_LENGHT,
  HAIR_SERVICE_INGREDIENT_HEIGHT,
  HAIR_SERVICE_INGREDIENT_HEIGHT_MAX_DECIMAL_PLACES,
  HAIR_SERVICE_INGREDIENT_OXIDIZING,
  HAIR_SERVICE_INGREDIENT_OXIDIZING_MAX_DECIMAL_PLACES,
  HAIR_SERVICE_INGREDIENT_QUANTITY_LENGHT,
  HAIR_SERVICE_INGREDIENT_TONE_LENGHT,
} from '../constants';

export class HairServiceIngredientsDto implements IHairServiceIngredient {
  @ApiProperty({
    description: 'Ingredient brand.',
    example: 'Schwarzkopf Professional',
    maxLength: HAIR_SERVICE_INGREDIENT_BRAND_LENGHT.MAX,
    minLength: HAIR_SERVICE_INGREDIENT_BRAND_LENGHT.MIN,
  })
  @Length(
    HAIR_SERVICE_INGREDIENT_BRAND_LENGHT.MIN,
    HAIR_SERVICE_INGREDIENT_BRAND_LENGHT.MAX,
  )
  brand: string;

  @ApiProperty({
    description: 'Ingredient height.',
    example: 9,
    maximum: HAIR_SERVICE_INGREDIENT_HEIGHT.MAX,
    minimum: HAIR_SERVICE_INGREDIENT_HEIGHT.MIN,
  })
  @IsNumber({
    maxDecimalPlaces: HAIR_SERVICE_INGREDIENT_HEIGHT_MAX_DECIMAL_PLACES,
  })
  @Max(HAIR_SERVICE_INGREDIENT_HEIGHT.MAX)
  @Min(HAIR_SERVICE_INGREDIENT_HEIGHT.MIN)
  height: number;

  @ApiProperty({
    description: 'Ingredient oxidizing percentage.',
    example: 15,
    maximum: HAIR_SERVICE_INGREDIENT_OXIDIZING.MAX,
    minimum: HAIR_SERVICE_INGREDIENT_OXIDIZING.MIN,
  })
  @IsNumber({
    maxDecimalPlaces: HAIR_SERVICE_INGREDIENT_OXIDIZING_MAX_DECIMAL_PLACES,
  })
  @Max(HAIR_SERVICE_INGREDIENT_OXIDIZING.MAX)
  @Min(HAIR_SERVICE_INGREDIENT_OXIDIZING.MIN)
  oxidizing: number;

  @ApiProperty({
    description: 'Ingredient quantity.',
    example: '100gr',
    maxLength: HAIR_SERVICE_INGREDIENT_QUANTITY_LENGHT.MAX,
    minLength: HAIR_SERVICE_INGREDIENT_QUANTITY_LENGHT.MIN,
  })
  @Length(
    HAIR_SERVICE_INGREDIENT_QUANTITY_LENGHT.MIN,
    HAIR_SERVICE_INGREDIENT_QUANTITY_LENGHT.MAX,
  )
  quantity: string;

  @ApiProperty({
    description: 'Ingredient tone.',
    example: '7-22',
    maxLength: HAIR_SERVICE_INGREDIENT_TONE_LENGHT.MAX,
    minLength: HAIR_SERVICE_INGREDIENT_TONE_LENGHT.MIN,
  })
  @Length(
    HAIR_SERVICE_INGREDIENT_TONE_LENGHT.MIN,
    HAIR_SERVICE_INGREDIENT_TONE_LENGHT.MAX,
  )
  tone: string;
}

export class CreateHairServiceIngredientsDto
  extends HairServiceIngredientsDto
  implements ICreateHairServiceIngredient {}

export class UpdateHairServiceIngredientsDto
  extends PartialType(HairServiceIngredientsDto)
  implements Partial<ICreateHairServiceIngredient> {}
