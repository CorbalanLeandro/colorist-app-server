import { isString } from 'class-validator';
import { isMatch } from 'date-fns';

import { SHEET_DATE_FORMAT, SHEET_DATE_REGEX } from '../constants';

/**
 * Value is sheet date format.
 *
 * @param {string} value
 * @returns {string}
 */
export const isSheetDate = (value: unknown): value is string =>
  isString(value) &&
  SHEET_DATE_REGEX.test(value) &&
  isMatch(value, SHEET_DATE_FORMAT);
