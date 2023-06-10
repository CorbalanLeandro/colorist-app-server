import { IBacicDocumentDto } from '../../../common';
import { IClient, IClientDto } from '../../client/interfaces';

export interface IColoristAttributes {
  email: string;
  hairSalonName?: string;
  lastName: string;
  name: string;
  password: string;
  username: string;
}

interface IColoristObjectIdAttributes {
  clients: IClient[];
}

interface IColoristDtoObjectIdAttributes {
  clients: IClientDto[];
}

export interface IColorist
  extends IColoristAttributes,
    IColoristObjectIdAttributes {}

export interface IColoristDto
  extends IColoristAttributes,
    IColoristDtoObjectIdAttributes,
    IBacicDocumentDto {}

/**
 * when creating a Colorist, we will always have the clients array empty.
 */
export type ICreateColorist = IColoristAttributes;

/**
 * when creating a Colorist, we will always have the clients array empty.
 */
export type ICreateColoristDto = IColoristAttributes;

export interface ICreateColoristResponseDto
  extends ICreateColorist,
    IBacicDocumentDto {
  clients: string[];
}

export interface IColoristSignInDto {
  emailOrUsername: string;
  password: string;
}
