import {
  CustomDecorator,
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';

import { Request } from 'express';

import { IS_PUBLIC_KEY } from '../constants';

/**
 * Directive to make a controller or route public.
 *
 * @returns {CustomDecorator<string>}
 */
export const Public = (): CustomDecorator<string> =>
  SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Gets the colorist._id in request
 *
 * @returns {ParameterDecorator}
 */
export const ColoristId = createParamDecorator((_, ctx: ExecutionContext) => {
  const { coloristId } = ctx.switchToHttp().getRequest<Request>();
  return coloristId;
});
