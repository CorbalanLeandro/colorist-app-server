import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ValidatorProps, HydratedDocument } from 'mongoose';

import { ColoristIdSchema, isMongoIdPropValidator } from '../../../common';
import { IHairService, ISheet, ISheetAttributes } from '../interfaces';
import { SHEET_DATE_FORMAT, SHEET_MAX_HAIR_SERVICES } from '../constants';
import { isSheetDate } from '../utils';
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
    trim: true,
    type: String,
    validate: {
      message: (props: ValidatorProps) =>
        `${props.value} is an invalid date format. Must be ${SHEET_DATE_FORMAT}`,
      validator: (value: unknown) => isSheetDate(value),
    },
  })
  date: string;

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
