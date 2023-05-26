import { isMongoId } from 'class-validator';
import { ValidateOpts, ValidatorProps } from 'mongoose';

export const isMongoIdPropValidator: ValidateOpts<unknown> = {
  message: (props: ValidatorProps) => `${props.value} is not a valid mongo id.`,
  validator: (value: unknown) => isMongoId(value),
};

export const PARAM_ID = 'id';
