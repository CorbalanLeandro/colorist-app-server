import { IBacicDocumentDto, IColoristId } from '../../../common';
import { IHairServiceIngredient } from './hair-service-ingredient.interface';

export interface IHairService extends IColoristId {
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

export interface IHairServiceDto extends IHairService, IBacicDocumentDto {}

export type ICreateHairService = IHairService;
export type ICreateHairServiceDto = Omit<IHairService, 'coloristId'>;
