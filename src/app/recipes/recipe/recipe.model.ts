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


export const testRecipes = [
  new Recipe(
    'Spaghetii Carbonara',
    [
      new Product('pasta', 500, 'g'),
      new Product('egg', 4, 'pcs'),
      new Product('bacon', 200, 'g'),
      new Product('Parmezan', 200, 'g'),
      new Product('salt', 1, 'g'),
      new Product('pepper', 1, 'g')
    ],
    [
      'boil water',
      'crush Parmezan',
      'chop bacon',
      'mix eggs with parmezan and pepper',
      'fry bacon till golden',
      'boil pasta according to package instructions',
      'mix pasta with eggs and parmezan mixture',
      'add bacon',
      'serve with fresh grated cheese and pepper'
    ]
  ),
  new Recipe(
    'Spaghetii Bolognese',
    [
      new Product('pasta', 500, 'g'),
      new Product('minced beef', 300, 'g'),
      new Product('tomato can', 2, 'pc'),
      new Product('Parmezan', 50, 'g'),
      new Product('red wine', 1, 'bottle'),
      new Product('salt', 1, 'g'),
      new Product('pepper', 1, 'g')
    ],
    [
      'boil water',
      'crush Parmezan',
      'chop bacon',
      'fry meat with red wine',
      'mix meat with tomatos on the pan',
      'boil pasta according to package instructions',
      'serve with fresh grated cheese and pepper'
    ]
  ),
]
