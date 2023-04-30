import { Ingredient } from "./ingredient.model";

export class Recipe {
  constructor(
    public id: string,
    public name: string,
    public ingredients: Ingredient[],
    public prepSteps: string[],
    public prepTime: number = 0,
    public difficulty: string = '',
    public tags: string[] = [],
    public servings: number = -1,
    public description?: string,
  ) {}
}

export const units = ['g', 'kg', 'tbs.', 'pc', 'pcs', 'tsp.', 'cup'];
export const difficulty = ['easy', 'medium', 'hard'];
