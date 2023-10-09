import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ColoristIdSchema, isMongoIdPropValidator } from '../../../common';

import {
  IHairService,
  IHairServiceAttributes,
  IHairServiceIngredient,
} from '../interfaces';

import { HairServiceIngredientSchema } from './hair-service-ingredient.schema';

import {
  HAIR_SERVICE_NAME_LENGTH,
  HAIR_SERVICE_OBSERVATIONS_LENGTH,
} from '../constants';

export type HairServiceDocument = HydratedDocument<IHairService>;

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
    maxlength: HAIR_SERVICE_NAME_LENGTH.MAX,
    mimlength: HAIR_SERVICE_NAME_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
  })
  name: string;

  @Prop({
    maxlength: HAIR_SERVICE_OBSERVATIONS_LENGTH.MAX,
    mimlength: HAIR_SERVICE_OBSERVATIONS_LENGTH.MIN,
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
