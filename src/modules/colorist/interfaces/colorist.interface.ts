import { IBasicDocument, IColoristId } from '../../../common';
import { IClient, IClientDto } from '../../client/interfaces';

export interface IColoristAttributes {
  email: string;
  hairSalonName?: string;
  lastName: string;
  name: string;
  password: string;
  username: string;
}

export interface IColoristObjectIdAttributes {
  clients: IClient[];
}

interface IColoristDtoObjectIdAttributes {
  clients: IClientDto[];
}

export interface IColorist
  extends IColoristAttributes,
    IColoristObjectIdAttributes,
    IBasicDocument {}

export interface IColoristDto
  extends Omit<IColoristAttributes, 'password'>,
    IColoristDtoObjectIdAttributes,
    IBasicDocument {}

/**
 * when creating a Colorist, we will always have the clients array empty.
 */
export type ICreateColorist = IColoristAttributes;

/**
 * when creating a Colorist, we will always have the clients array empty.
 */
export type ICreateColoristDto = IColoristAttributes;

export interface ICreateColoristResponseDto
  extends Omit<ICreateColorist, 'password'>,
    IBasicDocument {
  clients: IClientDto[];
}

export interface IColoristSignInDto {
  emailOrUsername: string;
  password: string;
}

export interface IChangePasswordDto {
  newPassword: string;
  oldPassword: string;
}

export interface IChangePassword extends IChangePasswordDto, IColoristId {}
