import { Product } from "./product.model";

export class Ingredient implements Product {
  constructor(
    public name: string,
    public quantity?: number | null,
    public unit?: string | null,
    public inPantry?: boolean | null,
  ) {}

}

