import { IId } from '../../../common';
import { IColorist } from '../../colorist/interfaces';

export interface IJWTPayload {
  email: string;
  exp: number;
  iat: number;
  /**
   * colorist._id | ObjectId
   */
  sub: string;
  username: string;
}

export interface ISignInResponse {
  access_token: string;
}

export interface IAuthColorist
  extends Pick<IColorist, 'password' | 'email' | 'username'>,
    IId {}
