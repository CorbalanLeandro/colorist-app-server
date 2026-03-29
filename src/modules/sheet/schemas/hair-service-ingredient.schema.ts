import { Prop, Schema } from '@nestjs/mongoose';

import { IHairServiceIngredient } from '../interfaces';

import {
  HAIR_SERVICE_INGREDIENT_BRAND_LENGTH,
  HAIR_SERVICE_INGREDIENT_QUANTITY_LENGTH,
  HAIR_SERVICE_INGREDIENT_TONE_LENGTH,
} from '../constants';

@Schema({
  _id: false,
  timestamps: false,
})
export class HairServiceIngredientSchema implements IHairServiceIngredient {
  @Prop({
    maxlength: HAIR_SERVICE_INGREDIENT_BRAND_LENGTH.MAX,
    minlength: HAIR_SERVICE_INGREDIENT_BRAND_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
  })
  brand: string;

  @Prop({
    maxlength: HAIR_SERVICE_INGREDIENT_QUANTITY_LENGTH.MAX,
    minlength: HAIR_SERVICE_INGREDIENT_QUANTITY_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
  })
  quantity: string;

  @Prop({
    maxlength: HAIR_SERVICE_INGREDIENT_TONE_LENGTH.MAX,
    minlength: HAIR_SERVICE_INGREDIENT_TONE_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
  })
  tone: string;
}
