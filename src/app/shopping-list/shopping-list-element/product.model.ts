export class Product {
  constructor(
    public name: string,
    public quantity: number,
    public unit: string,
    public expDate?: Date,
    public bought?: boolean,
    public inPantry?: boolean,
  ) {}
}
