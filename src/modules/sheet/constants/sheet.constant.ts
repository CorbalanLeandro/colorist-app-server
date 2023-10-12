import { PopulateOptions } from 'mongoose';

export const SHEET_DATE_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;
export const SHEET_DATE_FORMAT = 'dd/MM/yyyy';

export const SHEET_POPULATE_OPTIONS: { populate: PopulateOptions } = {
  populate: { path: 'hairServices' },
};

export const SHEET_MAX_HAIR_SERVICES = 10;
