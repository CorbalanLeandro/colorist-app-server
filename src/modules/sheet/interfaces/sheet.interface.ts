import {
  ICursorResponse,
  IBasicDocument,
  IColoristId,
  SortDirection,
} from '../../../common';
import { IClientId } from '../../client/interfaces';
import { IHairService } from './hair-service.interface';

export interface ISheetId {
  sheetId: string;
}

export interface ISheetAttributes extends IColoristId, IClientId {
  date: Date;
  hairServices: IHairService[];
}

export interface ISheet extends ISheetAttributes, IBasicDocument {}

export type ICreateSheet = ISheetAttributes;

export type ICreateSheetDto = Omit<ICreateSheet, 'coloristId'>;

export interface IFindAllSheetsByClientIdOptions {
  cursor?: string;
  limit: number;
  sort?: SortDirection;
}

export interface IFindSheetsCursorQueryDto {
  cursor?: string;
  limit: number;
  sort?: SortDirection;
}
export type ISheetCursorResponseDto = ICursorResponse<ISheet>;

export interface IDeleteSheet extends IColoristId, ISheetId, IClientId {}

export interface IChangeClient extends IColoristId, ISheetId {
  newClientId: string;
  oldClientId: string;
}
export type IChangeClientDto = Pick<
  IChangeClient,
  'newClientId' | 'oldClientId'
>;
