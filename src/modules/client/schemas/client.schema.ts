import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Schema as MongooseSchema,
  ValidatorProps,
  HydratedDocument,
} from 'mongoose';

import {
  ATTRIBUTE_EMAIL_LENGTH,
  ATTRIBUTE_LAST_NAME_LENGTH,
  ATTRIBUTE_NAME_LENGTH,
  ATTRIBUTE_PHONE_NUMBER_LENGTH,
  ColoristIdSchema,
} from '../../../common';

import {
  IClient,
  IClientAttributes,
  IClientObjectIdAttributes,
} from '../interfaces';
import { Sheet } from '../../sheet/schemas';
import { isEmail } from 'class-validator';
import { ISheet } from '../../sheet/interfaces';

export type ClientDocument = HydratedDocument<IClient>;

@Schema({
  timestamps: true,
})
export class Client
  extends ColoristIdSchema
  implements IClientAttributes, IClientObjectIdAttributes
{
  @Prop({
    maxlength: ATTRIBUTE_EMAIL_LENGTH.MAX,
    minlength: ATTRIBUTE_EMAIL_LENGTH.MIN,
    trim: true,
    type: String,
    validate: {
      message: (props: ValidatorProps) => `${props.value} is an invalid email`,
      validator: (value: unknown) => isEmail(value),
    },
  })
  email?: string;

  @Prop({
    maxlength: ATTRIBUTE_LAST_NAME_LENGTH.MAX,
    minlength: ATTRIBUTE_LAST_NAME_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
  })
  lastName: string;

  @Prop({
    maxlength: ATTRIBUTE_NAME_LENGTH.MAX,
    minlength: ATTRIBUTE_NAME_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
  })
  name: string;

  @Prop({
    maxlength: ATTRIBUTE_PHONE_NUMBER_LENGTH.MAX,
    minlength: ATTRIBUTE_PHONE_NUMBER_LENGTH.MIN,
    trim: true,
    type: String,
  })
  phoneNumber?: string;

  @Prop({
    type: [
      {
        ref: Sheet.name,
        required: true,
        type: MongooseSchema.Types.ObjectId,
      },
    ],
  })
  sheets: ISheet[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
