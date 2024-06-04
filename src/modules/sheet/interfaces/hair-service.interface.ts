import { IHairServiceIngredient } from './hair-service-ingredient.interface';

export interface IHairService {
  ingredients: IHairServiceIngredient[];
  name: string;
  observations?: string;
}
