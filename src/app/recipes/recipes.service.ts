import { HttpClient, HttpEvent, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MonoTypeOperatorFunction, Observable, Subject, catchError, map, of, retry } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AuthService } from "../auth/auth.service";
import { Recipe } from "./recipe/recipe.model";
import { User_Recipes, Recipes_Base, Community_Recipes } from "./recipes-list/recipes-list.component";
import { PantryService } from "../pantry/pantry.service";

export const Fetch_Recipes_URL = 'https://mealselect-ce74f-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
export const Default_URL = 'https://mealselect-ce74f-default-rtdb.europe-west1.firebasedatabase.app/';

@Injectable({providedIn: 'root'})
export class RecipesService {

  private recipesBase: Recipe[] | undefined;
  private userRecipes: Recipe[] | undefined;
  private communityRecipes: Recipe[] | undefined;

  recipesBaseFetched: boolean = false;
  userRecipesFetched: boolean = false;
  error: boolean = false;

  recipesChanged = new Subject<string>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private pantryService: PantryService,
  ) {}

  fetchRecipes(recipesType: string) {
    if(recipesType === Recipes_Base) {
      this._fetchRecipesBase();
    }

    if(recipesType === User_Recipes) {
      this._fetchUserRecipes();
    }
  }

  getRecipes(recipesType: string): Recipe[] {
    let recipes: Recipe[];

    switch(recipesType) {
      case Community_Recipes:
        if(this.communityRecipes === null || this.communityRecipes === undefined) {
          recipes = [];
        } else {
          recipes = this.communityRecipes;
        }
        break;
      case User_Recipes:
        if(this.userRecipes === null || this.userRecipes === undefined) {
          recipes = []
        } else {
          recipes = this._updateRecipesInPantry(this.userRecipes);
        }
        break;
      default:
        if(this.recipesBase === null || this.recipesBase === undefined) {
          recipes = [];
        } else {
          recipes = this._updateRecipesInPantry(this.recipesBase);
        }
    }

    return recipes;
  }


  private _putRecipes(): Observable<Recipe> {
    const user =  this.authService.user!;
    const params = new HttpParams().set('auth', user.token);
    const recipes = this.userRecipes!.slice();
    return this.http.put<Recipe>(Default_URL + user.uid + '/recipes.json', recipes ,{params: params})
      .pipe(
        retry({count: 3, delay: 2000}),
        catchError((error) => {
          console.warn(error);
          this.toastr.error('Error: Connection to DataBase failed.');
          this.error = true;
          throw new Error(error);
        })
      )
  }

  addRecipe(recipe: Recipe): void {
    recipe.id = this.authService.user?.email! + recipe.id;
    if(this.userRecipes === null || this.userRecipes === undefined) {
      this.userRecipes = [recipe];
    } else {
      this.userRecipes.push(recipe);
    }
    this.recipesChanged.next(User_Recipes);
    this._putRecipes()
      .subscribe({
        next: () => {
          this.toastr.success('Successfully added recipe to Your Recipes.');
          this.router.navigate(['recipes']);
        },
        error: (error) => {
          this.toastr.error('Recipe was not saved in DataBase.');
          console.warn(error);
        }
      });
  }

  deleteRecipe(id: string): void {
    this.userRecipes = this.userRecipes!.filter((recipe) => recipe.id !== id);
    this.recipesChanged.next(User_Recipes);
    this._putRecipes()
      .subscribe({
        next: () => {
          this.toastr.success('Successfully removed recipe from Your Recipes.');
          this.router.navigate(['recipes']);
        },
        error: (error) => {
          this.toastr.error('Update of your Recipes was not saved in DataBase.');
          console.warn(error);
        }
      });
  }

  updateRecipe(updatedRecipe: Recipe): void {
    this.userRecipes!.map(rec => rec.id === updatedRecipe.id ? updatedRecipe : rec);
    this.recipesChanged.next(User_Recipes);
    this._putRecipes();
  }

  private _fetchRecipesBase(): void {
    this.error = false;
    const params = new HttpParams().set('auth', this.authService.user!.token);

    this.http.get<Recipe[]>(Fetch_Recipes_URL, {params: params})
      .pipe(
        retry({count: 3, delay: 2000}),
        catchError((error) => {
          console.warn(error);
          this.toastr.error('Error: Downloading of recipes base from sever failed.');
          this.error = true;
          return of([]);
        })
        )
        .subscribe((recipes) => {
          this.recipesBase = recipes.slice();
          this.recipesChanged.next(Recipes_Base);
          if(!this.error) this.recipesBaseFetched = true;
        });
  }

  private _fetchUserRecipes(): void {
    this.error = false;
    const user =  this.authService.user!;
    const params = new HttpParams().set('auth', user.token);
    const URL = Default_URL + user.uid + '/recipes.json';

    this.http.get<Recipe[]>(URL, {params: params})
    .pipe(
      catchError((error) => {
        console.warn(error);
        this.toastr.error('Error: Downloading of your recipes from sever failed.');
        this.error = true;
        return of([]);
      })
      )
      .subscribe((recipes) => {
        if (recipes === null) {
          this.userRecipes = [];
        } else {
          this.userRecipes = recipes.slice();
        }
        this.recipesChanged.next(User_Recipes);
        if(!this.error) this.userRecipesFetched = true;
      });
  }

  private _updateRecipesInPantry(recipes: Recipe[]): Recipe[] {
    const pantry = this.pantryService.getPantry();
    recipes = recipes.map((recipe) => {
        recipe.ingredients = recipe.ingredients.map((ing) => {
          const inPantry = pantry.some((prod) => {
            return prod.name === ing.name && prod.quantity! >= ing.quantity!
          })
          ing.inPantry = inPantry;
          return ing;
        })
        return recipe;
      });
      return recipes;
  }
}
