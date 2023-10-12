import { IBasicDocument, IBasicQueryDto, IColoristId } from '../../../common';
import { IClientId } from '../../client/interfaces';
import {
  ICreateHairServiceDto,
  IHairService,
  IHairServiceDto,
} from '../../hair-service/interfaces';

export interface ISheetId {
  sheetId: string;
}

export interface ISheetObjectIdAttributes {
  hairServices: IHairService[];
}

interface ISheetDtoObjectIdAttributes {
  hairServices: IHairServiceDto[];
}

export type ICreateHairServiceInSheet = Omit<
  ICreateHairServiceDto,
  'clientId' | 'sheetId'
>;

interface ICreateSheetObjectIdAttributes {
  hairServices: ICreateHairServiceInSheet[];
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

export type ICreateSheet = ISheetAttributes;

export interface ICreateSheetWithHairServices
  extends ISheetAttributes,
    ICreateSheetObjectIdAttributes {}

export interface ICreateSheetDto
  extends Omit<ICreateSheet, 'coloristId'>,
    ICreateSheetObjectIdAttributes {}

export interface ICreateSheetResponseDto
  extends ISheetDto,
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
