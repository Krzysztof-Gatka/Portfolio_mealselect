export class Product {
  constructor(
    public name: string,
    public quantity?: number | null,
    public unit?: string | null,
  ) {}
}
