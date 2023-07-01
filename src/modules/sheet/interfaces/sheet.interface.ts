import {
  IBasicDocumentDto,
  IBasicQueryDto,
  IColoristId,
} from '../../../common';
import { IHairService, IHairServiceDto } from '../../hair-service/interfaces';

interface ISheetObjectIdAttributes {
  hairServices: IHairService[];
}

interface ISheetDtoObjectIdAttributes {
  hairServices: IHairServiceDto[];
}

export interface ISheetAttributes extends IColoristId {
  /**
   * Clients's _id to which this sheet belongs
   */
  clientId: string;
  date: string;
}

export interface ISheet extends ISheetAttributes, ISheetObjectIdAttributes {}

export interface ISheetDto
  extends ISheetAttributes,
    ISheetDtoObjectIdAttributes,
    IBasicDocumentDto {}

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
    IBasicDocumentDto,
    IColoristId {}

export type IFindSheetsQueryDto = IBasicQueryDto;

export interface IDeleteSheet extends IColoristId {
  clientId: string;
  sheetId: string;
}
