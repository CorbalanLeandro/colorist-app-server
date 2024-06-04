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
  ATTRIBUTE_USERNAME_LENGTH,
} from '../../../common';

import {
  IColorist,
  IColoristAttributes,
  IColoristObjectIdAttributes,
} from '../interfaces';
import { isAlphanumeric, isEmail } from 'class-validator';
import { Client } from '../../client/schemas';
import { COLORIST_HAIR_SALON_NAME_LENGTH } from '../constants';
import { IClient } from '../../client/interfaces';

export type ColoristDocument = HydratedDocument<IColorist>;

@Schema({
  timestamps: true,
})
export class Colorist
  implements IColoristAttributes, IColoristObjectIdAttributes
{
  @Prop({
    type: [
      {
        ref: Client.name,
        required: true,
        type: MongooseSchema.Types.ObjectId,
      },
    ],
  })
  clients: IClient[];

  @Prop({
    immutable: true,
    lowercase: true,
    maxlength: ATTRIBUTE_EMAIL_LENGTH.MAX,
    minlength: ATTRIBUTE_EMAIL_LENGTH.MIN,
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
    minlength: COLORIST_HAIR_SALON_NAME_LENGTH.MIN,
    trim: true,
    type: String,
  })
  hairSalonName?: string;

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
    required: true,
    trim: true,
    type: String,
  })
  password: string;

  @Prop({
    immutable: true,
    lowercase: true,
    maxlength: ATTRIBUTE_USERNAME_LENGTH.MAX,
    minlength: ATTRIBUTE_USERNAME_LENGTH.MIN,
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
