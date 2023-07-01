import { IBasicDocument, IColoristId } from '../../../common';
import { IHairServiceIngredient } from './hair-service-ingredient.interface';

export interface IHairServiceAttributes extends IColoristId {
  /**
   * Clients's _id to which this hair service belongs
   */
  clientId: string;
  ingredients: IHairServiceIngredient[];
  name: string;
  observations?: string;
  /**
   * Sheet's _id to which this hair service belongs
   */
  sheetId: string;
}

export interface IHairService extends IHairServiceAttributes, IBasicDocument {}

export interface IHairServiceDto
  extends IHairServiceAttributes,
    IBasicDocument {}

export type ICreateHairService = IHairServiceAttributes;
export type ICreateHairServiceDto = Omit<IHairServiceAttributes, 'coloristId'>;

export interface IDeleteHairService extends IColoristId {
  hairServiceId: string;
  sheetId: string;
}
