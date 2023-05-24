import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IId, ITimestamp, isMongoIdPropValidator } from '../../../common';
import { IHairService, IHairServiceIngredient } from '../interfaces';
import { HairServiceIngredientSchema } from './hair-service-ingredient.schema';

import {
  HAIR_SERVICE_NAME_LENGHT,
  HAIR_SERVICE_OBSERVATIONS_LENGHT,
} from '../constants';

export type HairServiceDocument = HairService & Document & ITimestamp & IId;

@Schema({
  timestamps: true,
})
export class HairService implements IHairService {
  @Prop({
    required: true,
    type: String,
    validate: isMongoIdPropValidator,
  })
  coloristId: string;

  @Prop({ required: true, type: HairServiceIngredientSchema })
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
}
