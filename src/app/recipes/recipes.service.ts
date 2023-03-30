import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Recipe } from "./recipe/recipe.model";

const Fetch_Recipes_URL = 'https://mealselect-ce74f-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
const default_URL = 'https://mealselect-ce74f-default-rtdb.europe-west1.firebasedatabase.app/';

@Injectable({providedIn: 'root'})
export class RecipesService {
  recipesFetched = new Subject();
  userRecipesFetched = new Subject();
  recipesBase: Recipe[] = [];
  userRecipes: Recipe[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  fetchRecipesBase(): void {
    const params = new HttpParams().set('auth', this.authService.user?.token!);

    this.http.get<Recipe[]>(Fetch_Recipes_URL, {params: params}).subscribe((response) => {
      this.recipesBase = response.map((recipe) =>
        new Recipe(
          recipe.id, recipe.name, recipe.ingredients, recipe.prepSteps,
          recipe.prepTime, recipe.difficulty, recipe.tags, recipe.servings, recipe.pricePerServing
        )
      );
      this.recipesFetched.next('');
    });
  }

  fetchUserRecipes(): void {
    const user =  this.authService.user!;
    const params = new HttpParams().set('auth', user.token);
    this.http.get<Recipe[]>(default_URL + user.uid + '/recipes.json', {params: params})
      .subscribe((recipes) => {
        this.userRecipes = recipes.slice();
        this.userRecipesFetched.next('');
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
