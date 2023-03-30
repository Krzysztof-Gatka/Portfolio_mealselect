import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe/recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.scss']
})
export class UserRecipesComponent implements OnInit{
  recipes: Recipe[] = [];

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.recipesService.fetchUserRecipes().subscribe((recipes) => {
      this.recipes = recipes.slice();
    });
  }
}
