import { Injectable } from "@angular/core";
import { Recipe } from "./recipe/recipe.model";
import { My_Recipes, Recipes_Base } from "./recipes-list/recipes-list.component";
import { RecipesService } from "./recipes.service";

@Injectable({providedIn: 'root'})
export class RecipesFilterService {

  constructor(private recipesService: RecipesService) {}

  filter(recipesType: string, name: string | null, prepTime: string | null, difficulty: string | null, price: string | null ): Recipe[] {
    let filteredRecipes: Recipe[] = [];

    if(recipesType === Recipes_Base) filteredRecipes = this.recipesService.recipesBase.slice();
    if(recipesType === My_Recipes) filteredRecipes = this.recipesService.userRecipes.slice();

    if(name !== null) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        return recipe.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
      })
    }

    if(prepTime !== null){
      filteredRecipes = filteredRecipes.filter(recipe => {
        return recipe.prepTime.toLowerCase().indexOf(prepTime.toLowerCase()) !== -1;
      })
    }

    if(difficulty !== null) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        return recipe.difficulty.toLowerCase().indexOf(difficulty.toLowerCase()) !== -1;
      })
    }

    return filteredRecipes.slice();
  }

  sort(recipes: Recipe[], sortingValue: string): Recipe[] {
    const diffSortHelp = {
      easy: 1,
      medium: 2,
      hard: 3,
    }

    let sortedRecipes = recipes.slice();

    switch(sortingValue){
      case 'prepTimeAscending':
        sortedRecipes.sort((a, b) => {
          return parseInt(a.prepTime.split(' ')[0]) - parseInt(b.prepTime.split(' ')[0])
        });
        break;
      case 'prepTimeDescending':
        sortedRecipes.sort((a, b) => {
          return parseInt(b.prepTime.split(' ')[0]) - parseInt(a.prepTime.split(' ')[0])
        });
        break;
      case 'difficultyAscending':
        sortedRecipes.sort((a, b) => {
          return diffSortHelp[a.difficulty as keyof typeof diffSortHelp] - diffSortHelp[b.difficulty as keyof typeof diffSortHelp];
        });
        break;
      case 'difficutlyDescending':
        sortedRecipes.sort((a, b) => {
          return diffSortHelp[b.difficulty as keyof typeof diffSortHelp] - diffSortHelp[a.difficulty as keyof typeof diffSortHelp];
        });
        break;
      case 'priceAscending':
        sortedRecipes.sort((a, b) => {
          return (a.pricePerServing * a.servings) - (b.pricePerServing * b.servings);
        });
        break;
      case 'priceDescending':
        sortedRecipes.sort((a, b) => {
          return (b.pricePerServing * b.servings) - (a.pricePerServing * a.servings);
        });
        break;
    }
    sortedRecipes
    return sortedRecipes.slice();
  }
}
