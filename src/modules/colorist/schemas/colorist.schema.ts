import { Logger } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ValidatorProps } from 'mongoose';
import { pbkdf2Sync } from 'crypto';

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

import {
  COLORIST_HAIR_SALON_NAME_LENGTH,
  COLORIST_PASSWORD_SALT,
} from '../constants';

export type ColoristDocument = Colorist & Document & IBacicDocument;

@Schema({
  timestamps: true,
})
export class Colorist implements IColorist {
  @Prop([
    {
      ref: Client.name,
      required: true,
      type: MongooseSchema.Types.ObjectId,
    },
  ])
  clients: Client[];

  @Prop({
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
    maxlength: ATTRIBUTE_USERNAME_LENGTH.MAX,
    mimlength: ATTRIBUTE_USERNAME_LENGTH.MIN,
    required: true,
    trim: true,
    type: String,
    unique: true,
    validate: {
      message: (props: ValidatorProps) => `${props.value} is an invalid email`,
      validator: (value: unknown) => isAlphanumeric(value),
    },
  })
  username: string;

  static encryptPassword(password: string): string {
    return pbkdf2Sync(
      password,
      COLORIST_PASSWORD_SALT,
      1000,
      64,
      'sha512',
    ).toString('hex');
  }
}

export const ColoristSchema = SchemaFactory.createForClass(Colorist);

ColoristSchema.pre('save', function (next) {
  try {
    if (!this.isModified('password')) {
      next();
    }

    const hashedPassword = Colorist.encryptPassword(this.password);

    this.password = hashedPassword;

    next();
  } catch (error: any) {
    Logger.error('Could not encrypt password.', {
      error,
      username: this.username,
    });

    next(error);
  }
});
