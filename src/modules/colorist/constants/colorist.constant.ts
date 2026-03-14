import { IColorist } from '../interfaces';

export enum COLORIST_HAIR_SALON_NAME_LENGTH {
  MIN = 3,
  MAX = 50,
}

export enum COLORIST_PASSWORD_LENGTH {
  MIN = 5,
  MAX = 128,
}

export const COLORIST_BASE_PROJECTIONS: Partial<
  Record<keyof IColorist, boolean>
> = {
  password: false,
};
