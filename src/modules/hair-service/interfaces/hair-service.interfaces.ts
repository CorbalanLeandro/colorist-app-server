import { IHairServiceIngredient } from './hair-service-ingredient.interfaces';

export interface IHairService {
  /**
   * will not be populated, only for validation
   */
  coloristId: string;
  ingredients: IHairServiceIngredient[];
  name: string;
  observations?: string;
}

export type ICreateHairService = Omit<IHairService, 'coloristId'>;
