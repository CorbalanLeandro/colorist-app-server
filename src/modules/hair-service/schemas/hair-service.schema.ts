import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import {
  ColoristIdSchema,
  IBacicDocument,
  isMongoIdPropValidator,
} from '../../../common';

import { IHairService, IHairServiceIngredient } from '../interfaces';
import { HairServiceIngredientSchema } from './hair-service-ingredient.schema';

import {
  HAIR_SERVICE_NAME_LENGHT,
  HAIR_SERVICE_OBSERVATIONS_LENGHT,
} from '../constants';

export type HairServiceDocument = HairService & Document & IBacicDocument;

@Schema({
  timestamps: true,
})
export class HairService extends ColoristIdSchema implements IHairService {
  @Prop([{ required: true, type: HairServiceIngredientSchema }])
  ingredients: IHairServiceIngredient[];

  @Prop({
    maxlength: HAIR_SERVICE_NAME_LENGHT.MAX,
    mimlength: HAIR_SERVICE_NAME_LENGHT.MIN,
    required: true,
    trim: true,
    type: String,
  })
  name: string;

  @Prop({
    maxlength: HAIR_SERVICE_OBSERVATIONS_LENGHT.MAX,
    mimlength: HAIR_SERVICE_OBSERVATIONS_LENGHT.MIN,
    trim: true,
    type: String,
  })
  observations?: string;

  @Prop({
    required: true,
    type: String,
    validate: isMongoIdPropValidator,
  })
  sheet: string;
}

export const HairServiceSchema = SchemaFactory.createForClass(HairService);
