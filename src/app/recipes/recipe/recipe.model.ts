import { Product } from "../../shopping-list/shopping-list-element/shopping-list-element.model";

export class Recipe {
  constructor(
    public id: string,
    public name: string,
    public ingredients: Product[],
    public prepSteps: string[],
    public prepTime: number = 0,
    public difficulty: string = '',
    public tags: string[] = [],
    public servings: number = -1,
    public lastPrepDate: Date | number = -1,
    public description?: string,
  ) {}
}

export const units = ['g', 'kg', 'tbs.', 'pc', 'pcs', 'tsp.', 'cup'];
export const difficulty = ['easy', 'medium', 'hard'];
