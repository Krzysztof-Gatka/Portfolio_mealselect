import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe/recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit{
  recipes: Recipe[] | undefined;

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.recipes = this.recipesService.recipesBase
  }
}
