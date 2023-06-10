import { PopulateOptions } from 'mongoose';

import { SHEET_POPULATE_OPTIONS } from '../../sheet/constants';

export const CLIENT_POPULATE_OPTIONS: { populate: PopulateOptions } = {
  populate: { path: 'sheets', ...SHEET_POPULATE_OPTIONS },
};
