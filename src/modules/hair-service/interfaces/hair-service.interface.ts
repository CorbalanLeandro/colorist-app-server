import { IBasicDocument, IColoristId } from '../../../common';
import { IClientId } from '../../client/interfaces';
import { ISheetId } from '../../sheet/interfaces';
import { IHairServiceIngredient } from './hair-service-ingredient.interface';

export interface IHairServiceAttributes
  extends IColoristId,
    ISheetId,
    IClientId {
  ingredients: IHairServiceIngredient[];
  name: string;
  observations?: string;
}

export interface IHairService extends IHairServiceAttributes, IBasicDocument {}

export interface IHairServiceDto
  extends IHairServiceAttributes,
    IBasicDocument {}

export type ICreateHairService = IHairServiceAttributes;
export type ICreateHairServiceDto = Omit<IHairServiceAttributes, 'coloristId'>;

export interface IDeleteHairService extends IColoristId, ISheetId {
  hairServiceId: string;
}
