import { IBacicDocumentDto } from '../../../common';
import { IHairServiceIngredient } from './hair-service-ingredient.interfaces';

export interface IHairService {
  /**
   * will not be used as reference to the colorist schema, only for validation
   */
  coloristId: string;
  ingredients: IHairServiceIngredient[];
  name: string;
  observations?: string;
  /**
   * Sheet's _id to which this hair service belongs
   */
  sheet: string;
}

export interface IHairServiceDto extends IHairService, IBacicDocumentDto {}

export type ICreateHairService = IHairService;
export type ICreateHairServiceDto = Omit<IHairService, 'coloristId'>;
