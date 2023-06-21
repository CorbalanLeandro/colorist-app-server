import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ValidatorProps } from 'mongoose';

import {
  ATTRIBUTE_EMAIL_LENGTH,
  ATTRIBUTE_LAST_NAME_LENGTH,
  ATTRIBUTE_NAME_LENGTH,
  ATTRIBUTE_USERNAME_LENGTH,
  IBacicDocument,
} from '../../../common';

import { IColorist } from '../interfaces';
import { isAlphanumeric, isEmail } from 'class-validator';
import { Client } from '../../client/schemas';
import { COLORIST_HAIR_SALON_NAME_LENGTH } from '../constants';

export type ColoristDocument = Colorist & Document & IBacicDocument;

@Schema({
  timestamps: true,
})
export class Colorist implements IColorist {
  @Prop({
    type: [
      {
        ref: Client.name,
        required: true,
        type: MongooseSchema.Types.ObjectId,
      },
    ],
  })
  clients: Client[];

  @Prop({
    immutable: true,
    maxlength: ATTRIBUTE_EMAIL_LENGTH.MAX,
    mimlength: ATTRIBUTE_EMAIL_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
    unique: true,
    validate: {
      message: (props: ValidatorProps) => `${props.value} is an invalid email`,
      validator: (value: unknown) => isEmail(value),
    },
  })
  email: string;

  @Prop({
    maxlength: COLORIST_HAIR_SALON_NAME_LENGTH.MAX,
    mimlength: COLORIST_HAIR_SALON_NAME_LENGTH.MIN,
    trim: true,
    type: String,
  })
  hairSalonName?: string;

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
    required: true,
    trim: true,
    type: String,
  })
  password: string;

  @Prop({
    immutable: true,
    maxlength: ATTRIBUTE_USERNAME_LENGTH.MAX,
    mimlength: ATTRIBUTE_USERNAME_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
    unique: true,
    validate: {
      message: (props: ValidatorProps) =>
        `${props.value} is an invalid username`,
      validator: (value: unknown) => isAlphanumeric(value),
    },
  })
  username: string;
}

export const ColoristSchema = SchemaFactory.createForClass(Colorist);
