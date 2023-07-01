import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ColoristIdSchema, isMongoIdPropValidator } from '../../../common';

import {
  IHairService,
  IHairServiceAttributes,
  IHairServiceIngredient,
} from '../interfaces';

import { HairServiceIngredientSchema } from './hair-service-ingredient.schema';

import {
  HAIR_SERVICE_NAME_LENGHT,
  HAIR_SERVICE_OBSERVATIONS_LENGHT,
} from '../constants';

export type HairServiceDocument = IHairService & Document;

@Schema({
  timestamps: true,
})
export class HairService
  extends ColoristIdSchema
  implements IHairServiceAttributes
{
  @Prop({
    required: true,
    type: String,
    validate: isMongoIdPropValidator,
  })
  clientId: string;

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
  sheetId: string;
}

export const HairServiceSchema = SchemaFactory.createForClass(HairService);
