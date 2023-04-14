import { Injectable } from "@angular/core";
import { Recipe } from "./recipe/recipe.model";
import { RecipesService } from "./recipes.service";

@Injectable({providedIn: 'root'})
export class RecipesFilterService {

  constructor(private recipesService: RecipesService) {}

  filter(recipesType: string, name: string | null, prepTime: number | null, difficulty: string | null, tags: string[]): Recipe[] {
    let filteredRecipes: Recipe[] = [];

    filteredRecipes = this.recipesService.getRecipes(recipesType);

    if(name !== null) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        return recipe.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
      })
    }

    if(prepTime !== null){
      filteredRecipes = filteredRecipes.filter(recipe => {
        return recipe.prepTime <= prepTime;
      })
    }

    if(difficulty !== null) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        return recipe.difficulty.toLowerCase().indexOf(difficulty.toLowerCase()) !== -1;
      })
    }

    if(tags.length !== 0) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const recipeTags = recipe.tags;
        if (!recipeTags) return false;
        return recipeTags.some((recipeTag) => tags.some((tag) => tag===recipeTag))
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
          return a.prepTime - b.prepTime;
        });
        break;
      case 'prepTimeDescending':
        sortedRecipes.sort((a, b) => {
          return b.prepTime - a.prepTime;
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
