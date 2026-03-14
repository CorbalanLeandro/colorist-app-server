import {
  IBasicDocument,
  IBasicQueryDto,
  IColoristId,
  SortDirection,
} from '../../../common';
import { IClientId } from '../../client/interfaces';
import { IHairService } from './hair-service.interface';

export interface ISheetId {
  sheetId: string;
}

export interface ISheetAttributes extends IColoristId, IClientId {
  date: string;
  hairServices: IHairService[];
}

export interface ISheet extends ISheetAttributes, IBasicDocument {}

export type ICreateSheet = ISheetAttributes;

export type ICreateSheetDto = Omit<ICreateSheet, 'coloristId'>;

export interface IFindSheetsQueryDto extends IBasicQueryDto {
  sort?: SortDirection;
}

export interface IDeleteSheet extends IColoristId, ISheetId, IClientId {}

export interface IChangeClient extends IColoristId, ISheetId {
  newClientId: string;
  oldClientId: string;
}
export type IChangeClientDto = Pick<
  IChangeClient,
  'newClientId' | 'oldClientId'
>;
