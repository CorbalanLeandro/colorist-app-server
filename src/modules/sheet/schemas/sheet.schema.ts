import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ColoristIdSchema, isMongoIdPropValidator } from '../../../common';
import { IHairService, ISheet, ISheetAttributes } from '../interfaces';
import { SHEET_MAX_HAIR_SERVICES } from '../constants';
import { HairServiceSchema } from './hair-service.schema';

export type SheetDocument = HydratedDocument<ISheet>;

@Schema({
  timestamps: true,
})
export class Sheet extends ColoristIdSchema implements ISheetAttributes {
  @Prop({
    required: true,
    type: String,
    validate: isMongoIdPropValidator,
  })
  clientId: string;

  @Prop({
    required: true,
    type: Date,
  })
  date: Date;

  @Prop({
    type: [HairServiceSchema],
    validate: {
      message: `hairServices array cannot exceed ${SHEET_MAX_HAIR_SERVICES} items`,
      validator: (value: unknown[]) => {
        return value.length <= SHEET_MAX_HAIR_SERVICES;
      },
    },
  })
  hairServices: IHairService[];
}

export const SheetSchema = SchemaFactory.createForClass(Sheet);
