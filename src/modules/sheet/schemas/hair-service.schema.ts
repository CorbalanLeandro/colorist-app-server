import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { isString } from 'class-validator';

import { IHairService, IHairServiceIngredient } from '../interfaces';
import { HairServiceIngredientSchema } from './hair-service-ingredient.schema';

import {
  HAIR_SERVICE_HEIGHT_LENGTH,
  HAIR_SERVICE_NAME_LENGTH,
  HAIR_SERVICE_OBSERVATIONS_LENGTH,
  OXIDIZING_REGEX_VALIDATION,
  OXIDIZING_VALIDATION_ERROR_MESSAGE,
} from '../constants';

@Schema({
  _id: false,
})
export class HairService implements IHairService {
  @Prop({
    maxlength: HAIR_SERVICE_HEIGHT_LENGTH.MAX,
    minlength: HAIR_SERVICE_HEIGHT_LENGTH.MIN,
    trim: true,
    type: String,
  })
  height?: string;

  @Prop([{ required: true, type: HairServiceIngredientSchema }])
  ingredients: IHairServiceIngredient[];

  @Prop({
    maxlength: HAIR_SERVICE_NAME_LENGTH.MAX,
    minlength: HAIR_SERVICE_NAME_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
  })
  name: string;

  @Prop({
    maxlength: HAIR_SERVICE_OBSERVATIONS_LENGTH.MAX,
    minlength: HAIR_SERVICE_OBSERVATIONS_LENGTH.MIN,
    trim: true,
    type: String,
  })
  observations?: string;

  @Prop({
    required: true,
    trim: true,
    type: String,
    validate: {
      message: OXIDIZING_VALIDATION_ERROR_MESSAGE,
      validator: (value: unknown) =>
        isString(value) && OXIDIZING_REGEX_VALIDATION.test(value),
    },
  })
  oxidizing: string;
}

export const HairServiceSchema = SchemaFactory.createForClass(HairService);
