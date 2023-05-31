import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  isNumber,
  isPositive,
} from 'class-validator';

export function IsQueryPositiveNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isQueryPositiveNumber',
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: {
        defaultMessage({ property }: ValidationArguments) {
          return `${property} must be a positive number.`;
        },
        validate(value: unknown) {
          return (
            isNumber(value, {
              allowInfinity: false,
              allowNaN: false,
              maxDecimalPlaces: 0,
            }) && isPositive(value)
          );
        },
      },
    });
  };
}
