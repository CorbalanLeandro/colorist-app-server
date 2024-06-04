import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IHairService, IHairServiceIngredient } from '../interfaces';
import { HairServiceIngredientSchema } from './hair-service-ingredient.schema';

import {
  HAIR_SERVICE_NAME_LENGTH,
  HAIR_SERVICE_OBSERVATIONS_LENGTH,
} from '../constants';

@Schema({
  _id: false,
})
export class HairService implements IHairService {
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
}

export const HairServiceSchema = SchemaFactory.createForClass(HairService);
