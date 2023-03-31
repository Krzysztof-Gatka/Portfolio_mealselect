import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Recipe } from "./recipe/recipe.model";
import { My_Recipes, Recipes_Base } from "./recipes-list/recipes-list.component";

export const Fetch_Recipes_URL = 'https://mealselect-ce74f-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
export const Default_URL = 'https://mealselect-ce74f-default-rtdb.europe-west1.firebasedatabase.app/';

@Injectable({providedIn: 'root'})
export class RecipesService {
  recipesFetched = new Subject<string>();

  recipesBase: Recipe[] = [];
  userRecipes: Recipe[] = [];
  communityRecipes: Recipe[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  fetchRecipesBase(): void {
    const params = new HttpParams().set('auth', this.authService.user!.token);

    this.http.get<Recipe[]>(Fetch_Recipes_URL, {params: params})
      .subscribe((recipes) => {
        this.recipesBase = recipes.slice();
        this.recipesFetched.next(Recipes_Base);
    });
  }

  fetchUserRecipes(): void {
    const user =  this.authService.user!;
    const params = new HttpParams().set('auth', user.token);
    const URL = Default_URL + user.uid + '/recipes.json';

    this.http.get<Recipe[]>(URL, {params: params})
      .subscribe((recipes) => {
        this.userRecipes = recipes.slice();
        this.recipesFetched.next(My_Recipes);
      });
  }

  addRecipeToDb(recipe: Recipe): void {
    const user =  this.authService.user!;
    const params = new HttpParams().set('auth', user.token);
    const recipes = this.userRecipes.slice();
    recipes.push(recipe);

    this.http.put(Default_URL + user.uid + '/recipes.json', recipes ,{params: params}).subscribe();
  }

}
