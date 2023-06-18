import { IId } from '../../../common';
import { IColorist } from '../../colorist/interfaces';

export interface IJWTPayload {
  exp: number;
  iat: number;
  /**
   * colorist._id | ObjectId
   */
  sub: string;
}

export interface ISignInResponse {
  access_token: string;
}

export interface IAuthColorist extends Pick<IColorist, 'password'>, IId {}
