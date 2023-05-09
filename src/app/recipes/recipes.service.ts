import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, of, retry } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AuthService } from "../auth/auth.service";
import { Recipe } from "./recipe/recipe.model";
import { User_Recipes, Recipes_Base } from "./recipes-list/recipes-list.component";
import { PantryService } from "../pantry/pantry.service";

export const Fetch_Recipes_URL = 'https://mealselect-ce74f-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
export const Default_URL = 'https://mealselect-ce74f-default-rtdb.europe-west1.firebasedatabase.app/';

@Injectable({providedIn: 'root'})
export class RecipesService {

  private recipesBase: Recipe[] | undefined;
  private userRecipes: Recipe[] | undefined;


  recipesBaseFetched: boolean = false;
  userRecipesFetched: boolean = false;
  error: boolean = false;

  sorting: {type: string, asc: boolean,  active: boolean} = {type: 'none', asc: false, active: false};
  timeFilterValue: number = -1;

  recipesChanged = new Subject<string>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private pantryService: PantryService,
  ) {}

  fetchRecipes(recipesType: string) {
    recipesType === Recipes_Base ? this._fetchRecipesBase() : this._fetchUserRecipes();
  }

  getRecipes(recipesType: string): Recipe[] {
    let recipes = (recipesType === User_Recipes) ? this.userRecipes : this.recipesBase;
    if(!recipes) return [];
    if(this.timeFilterValue !== -1) recipes = this.filterByTime(recipes);
    if(this.sorting.active) recipes = this.sort(recipes);
    return this._getRecipesWithIngsInPantry(recipes);
  }

  addRecipe(recipe: Recipe): void {
    recipe.id = this.authService.user!.email + recipe.id;
    const updatedRecipes = (!this.userRecipes) ? [recipe] : [...this.userRecipes, recipe];

    this._putRecipes(updatedRecipes)
      .subscribe({
        next: () => {
          this.userRecipes = updatedRecipes;
          this.recipesChanged.next(User_Recipes);
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
    const updatedRecipes = this.userRecipes!.filter((recipe) => recipe.id !== id);
    this._putRecipes(updatedRecipes)
    .subscribe({
        next: () => {
          this.userRecipes = updatedRecipes;
          this.recipesChanged.next(User_Recipes);
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
    const updatedRecipes = this.userRecipes!.map(rec => rec.id === updatedRecipe.id ? updatedRecipe : rec);
    this._putRecipes(updatedRecipes).subscribe({
      next: () => {
        this.userRecipes = updatedRecipes;
        this.recipesChanged.next(User_Recipes);
        this.toastr.success('Successfully updated recipe.');
        this.router.navigate(['recipes']);
        },
      error: (error) => {
        this.toastr.error('Recipe Could not be updated.');
        console.warn(error);
      }
    });
  }

  sort(recipes: Recipe[]): Recipe[] {
    const diffSortHelp = {
      easy: 1,
      medium: 2,
      hard: 3
    };

    let sortedRecipes = recipes.slice();

    switch(this.sorting.type){
      case 'time':
        sortedRecipes.sort((a, b) => {
          return (this.sorting.asc) ? a.prepTime - b.prepTime : b.prepTime - a.prepTime;
        });
        break;
      case 'difficulty':
        sortedRecipes.sort((a, b) => {
          return (this.sorting.asc) ?
           diffSortHelp[a.difficulty as keyof typeof diffSortHelp] - diffSortHelp[b.difficulty as keyof typeof diffSortHelp] :
           diffSortHelp[b.difficulty as keyof typeof diffSortHelp] - diffSortHelp[a.difficulty as keyof typeof diffSortHelp];
        });
        break;
      case 'ingredients':
        sortedRecipes.sort((a, b) => {
          return (this.sorting.asc) ?
            (a.ingredients.length - a.ingredients.filter(ing=>ing.inPantry).length) - (b.ingredients.length - b.ingredients.filter(ing=>ing.inPantry).length) :
            (b.ingredients.length - b.ingredients.filter(ing=>ing.inPantry).length) - (a.ingredients.length - a.ingredients.filter(ing=>ing.inPantry).length)
        });
        break;
    }
    return sortedRecipes;
  }

  filterByTime(recipes: Recipe[]): Recipe[] {
    return recipes.filter(recipe => recipe.prepTime <= this.timeFilterValue);
  }

  filterSearch(searchWords: string[], recipesType: string): Recipe [] {
    searchWords = searchWords.map((searchWords) => searchWords.toLowerCase())
    const recipes = this.getRecipes(recipesType);

    const filteredRecipes = recipes.map((recipe) => {
      let matches = 0;

      searchWords.map((searchWord) => {

        recipe.name
          .split(" ")
          .map(word => word.toLowerCase())
          .map((nameWord) => {
            if (nameWord.includes(searchWord)) matches++
          });

        recipe.tags
          .map(tag => tag.toLowerCase())
          .map((tag) => {
            if(tag.includes(searchWord)) matches++
          });

        recipe.ingredients
          .map(ing => ing.name.toLowerCase())
          .map((ingredient) => {
            if(ingredient.includes(searchWord)) matches++
          });
      });

      return {recipe, matches}
    })
    .filter(rec => rec.matches > 0)
    .sort((a, b) => b.matches - a.matches)
    .map(rec => rec.recipe);

    return filteredRecipes;
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
      retry({count: 3, delay: 2000}),
      catchError((error) => {
        console.warn(error);
        this.toastr.error('Error: Downloading of your recipes from sever failed.');
        this.error = true;
        return of([]);
      })
      )
      .subscribe((recipes) => {
        this.userRecipes = recipes ? recipes.slice() : [];
        this.recipesChanged.next(User_Recipes);
        if(!this.error) this.userRecipesFetched = true;
      });
  }

  private _putRecipes(updatedRecipes: Recipe[]): Observable<Recipe> {
    const user =  this.authService.user!;
    const params = new HttpParams().set('auth', user.token);

    return this.http.put<Recipe>(Default_URL + user.uid + '/recipes.json', updatedRecipes ,{params: params})
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

  private _getRecipesWithIngsInPantry(recipes: Recipe[]): Recipe[] {
    const pantry = this.pantryService.getPantry();

    recipes = recipes.map(recipe => {
      recipe.ingredients = recipe.ingredients.map(ing => {
        ing.inPantry = pantry.some((prod) => prod.name === ing.name && prod.quantity! >= ing.quantity!)
        return ing;
      });

      return recipe;
    });

    return recipes;
  }
}
