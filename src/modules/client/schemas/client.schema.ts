import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ValidatorProps, HydratedDocument } from 'mongoose';

import {
  ATTRIBUTE_EMAIL_LENGTH,
  ATTRIBUTE_LAST_NAME_LENGTH,
  ATTRIBUTE_NAME_LENGTH,
  ATTRIBUTE_PHONE_NUMBER_LENGTH,
  ColoristIdSchema,
} from '../../../common';

import { IClient, IClientAttributes } from '../interfaces';
import { isEmail } from 'class-validator';

export type ClientDocument = HydratedDocument<IClient>;

@Schema({
  timestamps: true,
})
export class Client extends ColoristIdSchema implements IClientAttributes {
  @Prop({
    maxlength: ATTRIBUTE_EMAIL_LENGTH.MAX,
    minlength: ATTRIBUTE_EMAIL_LENGTH.MIN,
    nullable: true,
    trim: true,
    type: String,
    validate: {
      message: (props: ValidatorProps) => `${props.value} is an invalid email`,
      validator: (value: unknown) => value == null || isEmail(value),
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
    nullable: true,
    trim: true,
    type: String,
  })
  phoneNumber?: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
