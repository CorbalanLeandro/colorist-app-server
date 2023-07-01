import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Schema as MongooseSchema,
  ValidatorProps,
  HydratedDocument,
} from 'mongoose';

import { ColoristIdSchema, isMongoIdPropValidator } from '../../../common';

import {
  ISheet,
  ISheetAttributes,
  ISheetObjectIdAttributes,
} from '../interfaces';

import { HairService } from '../../hair-service/schemas';
import { SHEET_DATE_FORMAT } from '../constants';
import { isSheetDate } from '../utils';
import { IHairService } from '../../hair-service/interfaces';

export type SheetDocument = HydratedDocument<ISheet>;

@Schema({
  timestamps: true,
})
export class Sheet
  extends ColoristIdSchema
  implements ISheetAttributes, ISheetObjectIdAttributes
{
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
  hairServices: IHairService[];
}

export const SheetSchema = SchemaFactory.createForClass(Sheet);
