import { PopulateOptions } from 'mongoose';

import { IColorist } from '../interfaces';
import { CLIENT_POPULATE_OPTIONS } from '../../client/constants';

export enum COLORIST_HAIR_SALON_NAME_LENGTH {
  MIN = 3,
  MAX = 50,
}

export enum COLORIST_PASSWORD_LENGTH {
  MIN = 5,
  MAX = 128,
}

export const COLORIST_POPULATE_OPTIONS: { populate: PopulateOptions } = {
  populate: {
    path: 'clients',
    ...CLIENT_POPULATE_OPTIONS,
  },
};

export const COLORIST_BASE_PROJECTIONS: Partial<
  Record<keyof IColorist, boolean>
> = {
  password: false,
};
