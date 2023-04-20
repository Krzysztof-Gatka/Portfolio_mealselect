import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, catchError, of } from "rxjs";
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
  private communityRecipes: Recipe[] = [];

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
          recipes = this.userRecipes;
        }
        break;
      default:
        if(this.recipesBase === null || this.recipesBase === undefined) {
          recipes = [];
        } else {
          recipes = this.recipesBase;
        }
    }

    return recipes;
  }

  private _putRecipes(): void {
    const user =  this.authService.user!;
    const params = new HttpParams().set('auth', user.token);
    const recipes = this.userRecipes!.slice();
    this.http.put(Default_URL + user.uid + '/recipes.json', recipes ,{params: params})
      .subscribe(() => {
        this.toastr.success('Successfully updated Your Recipes');
        // this.router.navigate(['/recipes']);
      });
  }

  updateInPantry(): void {
    //userRecipes
    const pantry = this.pantryService.getPantry();
    this.userRecipes = this.userRecipes?.map((recipe) => {

      recipe.ingredients = recipe.ingredients.map((ing) => {

        const inPantry = pantry.some((prod) => {
          console.log(prod.name + '===' + ing.name + '&&' + prod.quantity! +">=" + ing.quantity!)
          return prod.name === ing.name && prod.quantity! >= ing.quantity!
        })

        ing.inPantry = inPantry;
        return ing;
      })
      console.log(recipe);
      return recipe;
    })

    this._putRecipes();
  }

  addRecipe(recipe: Recipe): void {
    recipe.id = this.authService.user?.email! + recipe.id;
    if(this.userRecipes === null || this.userRecipes === undefined) {
      this.userRecipes = [recipe];
    } else {
      this.userRecipes.push(recipe);
    }
    this.recipesChanged.next(User_Recipes);
    this._putRecipes();
  }

  deleteRecipe(id: string): void {
    this.userRecipes = this.userRecipes!.filter((recipe) => recipe.id !== id);
    this.recipesChanged.next(User_Recipes);
    this._putRecipes();
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
}
