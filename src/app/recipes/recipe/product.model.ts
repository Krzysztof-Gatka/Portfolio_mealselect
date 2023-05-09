
export class Product {
  constructor(
    public name: string,
    public quantity?: number | null,
    public unit?: string | null,
  ) {}
}


export const units_to_grams = {
  'g': 1,
  'kg': 1000,
  'lb': 454,
  'tbs': 15,
  'tsp': 5,
  'pc' : false,
  'ml': 1,
  'l': 1000,
  'to taste': false,
  'to serve': false,
};
