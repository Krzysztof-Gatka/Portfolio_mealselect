import { Component } from '@angular/core';
import { Recipe, testRecipes } from '../recipe/recipe.model';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent {
  recipes: Recipe[] = testRecipes;
}
