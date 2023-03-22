import { Product } from "../../shopping-list/shopping-list-element/product.model";

export class Recipe {
  constructor(
    public name: string,
    public ingredients: Product[],
    public prepSteps: string[],
    public prepTime: string = '',
    public difficulty: string = '',
    public tags: string[] = [],
    public lastPrepDate: Date | number = -1,
  ) {}
}
