import {
  ICursorResponse,
  IBasicDocument,
  IBasicQueryDto,
  IColoristId,
} from '../../../common';

export interface IClientId {
  clientId: string;
}

export interface IClientAttributes extends IColoristId {
  email?: string;
  lastName: string;
  name: string;
  phoneNumber?: string;
}

export interface IClient extends IClientAttributes, IBasicDocument {}

export interface IClientDto extends IClientAttributes, IBasicDocument {}

/**
 * when creating a client, we will always have the sheets array empty.
 */
export type ICreateClient = IClientAttributes;

/**
 * when creating a client, we will always have the sheets array empty.
 */
export type ICreateClientDto = Omit<IClientAttributes, 'coloristId'>;

export interface IFindClientsQueryDto extends IBasicQueryDto {
  lastName?: string;
  name?: string;
}

export interface IFindClientsCursorQueryDto extends IBasicQueryDto {
  cursor?: string;
  lastName?: string;
  name?: string;
}

export type IClientCursorResponseDto = ICursorResponse<IClientDto>;
