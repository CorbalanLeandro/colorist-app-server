import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ValidatorProps } from 'mongoose';

import {
  ColoristIdSchema,
  IBacicDocument,
  isMongoIdPropValidator,
} from '../../../common';

import { ISheet } from '../interfaces';
import { HairService } from '../../hair-service/schemas';
import { SHEET_DATE_FORMAT } from '../constants';
import { isSheetDate } from '../utils';

export type SheetDocument = Sheet & Document & IBacicDocument;

@Schema({
  timestamps: true,
})
export class Sheet extends ColoristIdSchema implements ISheet {
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
    type: [
      {
        ref: HairService.name,
        required: true,
        type: MongooseSchema.Types.ObjectId,
      },
    ],
  })
  hairServices: HairService[];
}

export const SheetSchema = SchemaFactory.createForClass(Sheet);
