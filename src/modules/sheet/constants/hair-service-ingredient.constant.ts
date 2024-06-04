export enum HAIR_SERVICE_INGREDIENT_BRAND_LENGTH {
  MAX = 50,
  MIN = 2,
}

export enum HAIR_SERVICE_INGREDIENT_HEIGHT_LENGTH {
  MAX = 5,
  MIN = 1,
}

export enum HAIR_SERVICE_INGREDIENT_QUANTITY_LENGTH {
  MAX = 10,
  MIN = 1,
}

export enum HAIR_SERVICE_INGREDIENT_TONE_LENGTH {
  MAX = 30,
  MIN = 1,
}

export const OXIDIZING_REGEX_VALIDATION = /^(\d{1,2}(\.\d{1,2})?|100)$/;
export const OXIDIZING_VALIDATION_ERROR_MESSAGE =
  'Oxidizing must be a number between 0 and 100 with no more than 2 decimals';
