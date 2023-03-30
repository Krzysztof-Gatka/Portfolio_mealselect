import { Component } from '@angular/core';
import { Recipe } from '../recipe/recipe.model';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.scss']
})
export class UserRecipesComponent {
  recipes: Recipe[] = [];
}
