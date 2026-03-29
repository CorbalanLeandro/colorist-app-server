import { IHairServiceIngredient } from './hair-service-ingredient.interface';

export interface IHairService {
  height?: string;
  ingredients: IHairServiceIngredient[];
  name: string;
  observations?: string;
  oxidizing: string;
}
