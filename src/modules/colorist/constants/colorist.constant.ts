import { IColorist } from '../interfaces';

export enum COLORIST_HAIR_SALON_NAME_LENGTH {
  MIN = 3,
  MAX = 50,
}

export enum COLORIST_PASSWORD_LENGTH {
  MIN = 5,
  MAX = 128,
}

export const COLORIST_PASSWORD_SALT = 'b1257947-7d0d-41a3-8dbb-3626e18742e0';

export const COLORIST_POPULATE_OPTIONS = {
  populate: {
    path: 'clients',
    populate: {
      path: 'sheets',
      populate: 'hairServices',
    },
  },
};

export const COLORIST_BASE_PROJECTIONS: Partial<
  Record<keyof IColorist, boolean>
> = {
  password: false,
};
