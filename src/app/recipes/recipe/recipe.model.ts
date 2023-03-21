import { Product } from "../../shopping-list/shopping-list-element/product.model";

export class Recipe {
  constructor(
    public name: string,
    public ingredients: Product[],
    public prepSteps: string[],

  ) {}

  public prepTime: string | undefined;
  public difficulty: string | undefined;
  public tags: string[] | undefined;
  public lastPrepDate: Date | undefined;


}
