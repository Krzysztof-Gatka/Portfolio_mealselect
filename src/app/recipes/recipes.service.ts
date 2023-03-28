import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Recipe } from "./recipe/recipe.model";

const Fetch_Recipes_URL = 'https://mealselect-ce74f-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

@Injectable({providedIn: 'root'})
export class RecipesService {
  recipesFetched = new Subject();
  recipesBase: Recipe[] = [];

  constructor(private http: HttpClient) {}

  fetchRecipes(): void {
    this.http.get<Recipe[]>(Fetch_Recipes_URL).subscribe((response) => {
      console.log(response);
      this.recipesBase = response.map((recipe) =>
        new Recipe(
          recipe.id, recipe.name, recipe.ingredients, recipe.prepSteps,
          recipe.prepTime, recipe.difficulty, recipe.tags, recipe.servings, recipe.pricePerServing
        )
      );
      this.recipesFetched.next('');
    });
  }

  filter(name: string | null, prepTime: string | null, difficulty: string | null, price: string | null ): Recipe[] {
    let filteredRecipes: Recipe[] = this.recipesBase.slice();

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

    return filteredRecipes;
  }

  sort(sortingValue: string): Recipe[] {
    const diffSortHelp = {
      easy: 1,
      medium: 2,
      hard: 3,
    }

    let sortedRecipes = this.recipesBase.slice();

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
    return sortedRecipes;
  }
}
