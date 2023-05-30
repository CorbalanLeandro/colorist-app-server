import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

import { isSheetDate } from '../utils';
import { SHEET_DATE_FORMAT } from '../constants';

/**
 * @decorator
 * @param {ValidationOptions} validationOptions
 * @returns
 */
export function IsSheetDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isSheetDate',
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: {
        defaultMessage({ property }: ValidationArguments) {
          return `${property} has an invalid date format. Must be ${SHEET_DATE_FORMAT}`;
        },
        validate(value: unknown) {
          return isSheetDate(value);
        },
      },
    });
  };
}
