import { IColorist } from '../../colorist/interfaces';

export interface IJWTPayload {
  email: string;
  exp: number;
  iat: number;
  jwtVersion: number;
  /**
   * colorist._id | ObjectId
   */
  sub: string;
  username: string;
}

export interface ISignInResponse {
  access_token: string;
}

export type IAuthColorist = Pick<
  IColorist,
  'password' | 'email' | 'username' | 'jwtVersion' | '_id'
>;
