import { IBasicDocument, IColoristId } from '../../../common';

export interface IColoristAttributes {
  email: string;
  hairSalonName?: string;
  jwtVersion: number;
  lastName: string;
  name: string;
  password: string;
  username: string;
}

export interface IColorist extends IColoristAttributes, IBasicDocument {}
type IColoristAttributesWithoutJWTVersion = Omit<
  IColoristAttributes,
  'jwtVersion'
>;

export interface IColoristDto
  extends Omit<IColoristAttributes, 'password' | 'jwtVersion'>,
    IBasicDocument {}

/**
 * when creating a Colorist, we will always have the clients array empty.
 */
export type ICreateColorist = IColoristAttributesWithoutJWTVersion;

/**
 * when creating a Colorist, we will always have the clients array empty.
 */
export type ICreateColoristDto = IColoristAttributesWithoutJWTVersion;

export interface ICreateColoristResponseDto
  extends Omit<ICreateColorist, 'password'>,
    IBasicDocument {}

export interface IColoristSignInDto {
  emailOrUsername: string;
  password: string;
}

export interface IChangePasswordDto {
  newPassword: string;
  oldPassword: string;
}

export interface IChangePassword extends IChangePasswordDto, IColoristId {}
