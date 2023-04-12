import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Recipe } from "./recipe/recipe.model";
import { My_Recipes, Recipes_Base } from "./recipes-list/recipes-list.component";
import { Router } from "@angular/router";

export const Fetch_Recipes_URL = 'https://mealselect-ce74f-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
export const Default_URL = 'https://mealselect-ce74f-default-rtdb.europe-west1.firebasedatabase.app/';

@Injectable({providedIn: 'root'})
export class RecipesService {
  recipesChanged = new Subject<string>();

  recipesBase: Recipe[] = [];
  userRecipes: Recipe[] = [];
  communityRecipes: Recipe[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  fetchRecipesBase(): void {
    const params = new HttpParams().set('auth', this.authService.user!.token);

    this.http.get<Recipe[]>(Fetch_Recipes_URL, {params: params})
      .subscribe((recipes) => {
        this.recipesBase = recipes.slice();
        this.recipesChanged.next(Recipes_Base);
    });
  }

  fetchUserRecipes(): void {
    const user =  this.authService.user!;
    const params = new HttpParams().set('auth', user.token);
    const URL = Default_URL + user.uid + '/recipes.json';

    this.http.get<Recipe[]>(URL, {params: params})
      .subscribe((recipes) => {
        this.userRecipes = recipes.slice();
        this.recipesChanged.next(My_Recipes);
      });
  }

  addRecipe(recipe: Recipe): void {
    this.userRecipes.push(recipe);
    this.recipesChanged.next(My_Recipes);
    this._addRecipeToDb();
  }

  private _addRecipeToDb(): void {
    const user =  this.authService.user!;
    const params = new HttpParams().set('auth', user.token);
    const recipes = this.userRecipes.slice();
    this.http.put(Default_URL + user.uid + '/recipes.json', recipes ,{params: params})
      .subscribe(() => {
        this.toastr.success('Successfully updated Your Recipes');
        this.router.navigate(['/recipes']);
      });
  }

  deleteRecipe(id: number): void {
    this.userRecipes = this.userRecipes.filter((recipe) => recipe.id !== id);
    this.recipesChanged.next(My_Recipes);
    this._addRecipeToDb();
  }

  updateRecipe(updatedRecipe: Recipe): void {
    this.userRecipes.map(rec => rec.id === updatedRecipe.id ? updatedRecipe : rec);
    this.recipesChanged.next(My_Recipes);
    this._addRecipeToDb();
  }
}
