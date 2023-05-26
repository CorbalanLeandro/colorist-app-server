import { Prop, Schema } from '@nestjs/mongoose';
import { ValidatorProps } from 'mongoose';
import { isNumber } from 'class-validator';

import { IHairServiceIngredient } from '../interfaces';

import {
  HAIR_SERVICE_INGREDIENT_BRAND_LENGHT,
  HAIR_SERVICE_INGREDIENT_HEIGHT,
  HAIR_SERVICE_INGREDIENT_HEIGHT_MAX_DECIMAL_PLACES,
  HAIR_SERVICE_INGREDIENT_OXIDIZING,
  HAIR_SERVICE_INGREDIENT_OXIDIZING_MAX_DECIMAL_PLACES,
  HAIR_SERVICE_INGREDIENT_QUANTITY_LENGHT,
  HAIR_SERVICE_INGREDIENT_TONE_LENGHT,
} from '../constants';

@Schema({
  _id: false,
  timestamps: false,
})
export class HairServiceIngredientSchema implements IHairServiceIngredient {
  @Prop({
    maxlength: HAIR_SERVICE_INGREDIENT_BRAND_LENGHT.MAX,
    minlength: HAIR_SERVICE_INGREDIENT_BRAND_LENGHT.MIN,
    required: true,
    trim: true,
    type: String,
  })
  brand: string;

  @Prop({
    max: HAIR_SERVICE_INGREDIENT_HEIGHT.MAX,
    min: HAIR_SERVICE_INGREDIENT_HEIGHT.MIN,
    required: true,
    trim: true,
    type: Number,
    validate: {
      message: (props: ValidatorProps) =>
        `${props.value} is not a valid height`,
      validator: (value: unknown) =>
        isNumber(value, {
          maxDecimalPlaces: HAIR_SERVICE_INGREDIENT_HEIGHT_MAX_DECIMAL_PLACES,
        }),
    },
  })
  height: number;

  @Prop({
    max: HAIR_SERVICE_INGREDIENT_OXIDIZING.MAX,
    min: HAIR_SERVICE_INGREDIENT_OXIDIZING.MIN,
    required: true,
    trim: true,
    type: Number,
    validate: {
      message: (props: ValidatorProps) =>
        `${props.value} is not a valid oxidizing percentage`,
      validator: (value: unknown) =>
        isNumber(value, {
          maxDecimalPlaces:
            HAIR_SERVICE_INGREDIENT_OXIDIZING_MAX_DECIMAL_PLACES,
        }),
    },
  })
  oxidizing: number;

  @Prop({
    maxlength: HAIR_SERVICE_INGREDIENT_QUANTITY_LENGHT.MAX,
    minlength: HAIR_SERVICE_INGREDIENT_QUANTITY_LENGHT.MIN,
    required: true,
    trim: true,
    type: String,
  })
  quantity: string;

  @Prop({
    maxlength: HAIR_SERVICE_INGREDIENT_TONE_LENGHT.MAX,
    minlength: HAIR_SERVICE_INGREDIENT_TONE_LENGHT.MIN,
    required: true,
    trim: true,
    type: String,
  })
  tone: string;
}
