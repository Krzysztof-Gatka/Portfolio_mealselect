import { Injectable } from "@angular/core";
import { Product } from "../shopping-list/shopping-list-element/product.model";
import { Recipe } from "./recipe/recipe.model";

@Injectable({providedIn: 'root'})
export class RecipesService {
  recipesBase = [
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
      ],
      '30 min',
      'easy',
      ['italian', 'pasta', 'quick', ],
      4,
      20
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
      ],
      '45 min',
      'hard',
      [],
      4,
      15,
    ),
    new Recipe(
      'Penne Pesto',
      [
        new Product('pasta', 500, 'g'),
        new Product('basil', 1, 'pc'),
        new Product('almonds', 20, 'g'),
        new Product('Parmezan', 100, 'g'),
        new Product('olive oil', 100, 'ml'),
        new Product('salt', 1, 'g'),
        new Product('pepper', 1, 'g'),
        new Product('cherry tomatos', 15, 'pcs'),
      ],
      [
        'blend olive oil with parmezan, almonds and basil',
        'pour olive oil on tomatos and spice it with salt and pepper',
        'put prepared tomatoes to oven for 15 mins on 200C',
        'cook pasta following package instructions',
        'mix the pasta with pesto',
        'serve with fresh grated parmezan, pepper and your baked tomatoes'
      ],
      '45 min',
      'medium',
      [],
      4,
      10
    ),
  ];
}
