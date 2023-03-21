import { Component } from '@angular/core';

import { Product } from 'src/app/shopping-list/shopping-list-element/product.model';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {
  recipe = new Recipe(
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
  )
}
