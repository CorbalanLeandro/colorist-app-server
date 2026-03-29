export enum HAIR_SERVICE_HEIGHT_LENGTH {
  MAX = 5,
  MIN = 1,
}

export enum HAIR_SERVICE_NAME_LENGTH {
  MAX = 50,
  MIN = 3,
}

export enum HAIR_SERVICE_OBSERVATIONS_LENGTH {
  MAX = 2000,
  MIN = 1,
}

export const OXIDIZING_REGEX_VALIDATION = /^(\d{1,2}(\.\d{1,2})?|100)$/;
export const OXIDIZING_VALIDATION_ERROR_MESSAGE =
  'Oxidizing must be a number between 0 and 100 with no more than 2 decimals';
