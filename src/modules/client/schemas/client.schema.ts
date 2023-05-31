import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ValidatorProps } from 'mongoose';

import {
  ATTRIBUTE_EMAIL_LENGTH,
  ATTRIBUTE_LAST_NAME_LENGTH,
  ATTRIBUTE_NAME_LENGTH,
  ATTRIBUTE_PHONE_NUMBER_LENGTH,
  ColoristIdSchema,
  IBacicDocument,
} from '../../../common';

import { IClient } from '../interfaces';
import { Sheet } from '../../sheet/schemas';
import { isEmail } from 'class-validator';

export type ClientDocument = Client & Document & IBacicDocument;

@Schema({
  timestamps: true,
})
export class Client extends ColoristIdSchema implements IClient {
  @Prop({
    maxlength: ATTRIBUTE_EMAIL_LENGTH.MAX,
    mimlength: ATTRIBUTE_EMAIL_LENGTH.MIN,
    required: true,
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
    mimlength: ATTRIBUTE_LAST_NAME_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
  })
  lastName: string;

  @Prop({
    maxlength: ATTRIBUTE_NAME_LENGTH.MAX,
    mimlength: ATTRIBUTE_NAME_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
  })
  name: string;

  @Prop({
    maxlength: ATTRIBUTE_PHONE_NUMBER_LENGTH.MAX,
    mimlength: ATTRIBUTE_PHONE_NUMBER_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
  })
  phoneNumber?: string;

  @Prop([
    {
      ref: Sheet.name,
      required: true,
      type: MongooseSchema.Types.ObjectId,
    },
  ])
  sheets: Sheet[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
