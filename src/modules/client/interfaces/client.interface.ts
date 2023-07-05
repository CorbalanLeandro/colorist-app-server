import { IBasicDocument, IBasicQueryDto, IColoristId } from '../../../common';

import { ISheet, ISheetDto } from '../../sheet/interfaces';

export interface IClientId {
  clientId: string;
}

export interface IClientAttributes extends IColoristId {
  email?: string;
  lastName: string;
  name: string;
  phoneNumber?: string;
}

export interface IClientObjectIdAttributes {
  sheets: ISheet[];
}

interface IClientDtoObjectIdAttributes {
  sheets: ISheetDto[];
}

export interface IClient
  extends IClientAttributes,
    IClientObjectIdAttributes,
    IBasicDocument {}

export interface IClientDto
  extends IClientAttributes,
    IClientDtoObjectIdAttributes,
    IBasicDocument {}

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
