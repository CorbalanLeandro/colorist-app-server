import { isMongoId } from 'class-validator';
import { ValidateOpts, ValidatorProps } from 'mongoose';

export const isMongoIdPropValidator: ValidateOpts<unknown> = {
  message: (props: ValidatorProps) => `${props.value} is not a valid mongo id.`,
  validator: (value: unknown) => isMongoId(value),
};

export const PARAM_ID = 'id';

export enum ATTRIBUTE_NAME_LENGTH {
  MIN = 3,
  MAX = 256,
}

export enum ATTRIBUTE_USERNAME_LENGTH {
  MIN = 3,
  MAX = 60,
}

export enum ATTRIBUTE_LAST_NAME_LENGTH {
  MIN = 3,
  MAX = 256,
}

export enum ATTRIBUTE_PHONE_NUMBER_LENGTH {
  MIN = 4,
  MAX = 16,
}

export enum ATTRIBUTE_EMAIL_LENGTH {
  MIN = 3,
  MAX = 256,
}
