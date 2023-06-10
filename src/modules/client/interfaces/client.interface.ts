import {
  IBacicDocumentDto,
  IBasicQueryDto,
  IColoristId,
} from '../../../common';

import { ISheet, ISheetDto } from '../../sheet/interfaces';

export interface IClientAttributes extends IColoristId {
  email?: string;
  lastName: string;
  name: string;
  phoneNumber?: string;
}

interface IClientObjectIdAttributes {
  sheets: ISheet[];
}

interface IClientDtoObjectIdAttributes {
  sheets: ISheetDto[];
}

export interface IClient extends IClientAttributes, IClientObjectIdAttributes {}

export interface IClientDto
  extends IClientAttributes,
    IClientDtoObjectIdAttributes,
    IBacicDocumentDto {}

/**
 * when creating a client, we will always have the sheets array empty.
 */
export type ICreateClient = IClientAttributes;

/**
 * when creating a client, we will always have the sheets array empty.
 */
export type ICreateClientDto = Omit<IClientAttributes, 'coloristId'>;

export interface ICreateClientResponseDto
  extends ICreateClient,
    IBacicDocumentDto,
    IColoristId {
  sheets: string[];
}

export interface IFindClientsQueryDto extends IBasicQueryDto {
  lastName?: string;
  name?: string;
}
