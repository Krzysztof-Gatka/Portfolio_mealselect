export class Product {
  constructor(
    public name: string,
    public quantity?: number | null,
    public unit?: string | null,
    public expDate?: Date | string | null,
    public bought?: boolean,
    public inPantry?: boolean,
  ) {}
}
