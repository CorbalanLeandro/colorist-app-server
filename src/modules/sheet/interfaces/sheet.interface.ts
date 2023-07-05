import { IBasicDocument, IBasicQueryDto, IColoristId } from '../../../common';
import { IClientId } from '../../client/interfaces';
import { IHairService, IHairServiceDto } from '../../hair-service/interfaces';

export interface ISheetId {
  sheetId: string;
}

export interface ISheetObjectIdAttributes {
  hairServices: IHairService[];
}

interface ISheetDtoObjectIdAttributes {
  hairServices: IHairServiceDto[];
}

export interface ISheetAttributes extends IColoristId, IClientId {
  date: string;
}

export interface ISheet
  extends ISheetAttributes,
    ISheetObjectIdAttributes,
    IBasicDocument {}

export interface ISheetDto
  extends ISheetAttributes,
    ISheetDtoObjectIdAttributes,
    IBasicDocument {}

/**
 * when creating a sheet, we will always have the hair services array empty.
 */
export type ICreateSheet = ISheetAttributes;

/**
 * when creating a sheet, we will always have the hair services array empty.
 */
export type ICreateSheetDto = Omit<ICreateSheet, 'coloristId'>;

export interface ICreateSheetResponseDto
  extends ICreateSheet,
    IBasicDocument,
    IColoristId {}

export type IFindSheetsQueryDto = IBasicQueryDto;

export interface IDeleteSheet extends IColoristId, ISheetId, IClientId {}

export interface IChangeClient extends IColoristId, ISheetId {
  newClientId: string;
  oldClientId: string;
}
export type IChangeClientDto = Pick<
  IChangeClient,
  'newClientId' | 'oldClientId'
>;
