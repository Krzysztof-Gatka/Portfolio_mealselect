import { Product } from "src/app/recipes/recipe/product.model";

export class ShoppingListElement implements Product {
  constructor(
    public name: string,
    public quantity?: number | null,
    public unit?: string | null,
    public bought?: boolean,
  ) {}


}
