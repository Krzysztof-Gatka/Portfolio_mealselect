import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipe/recipe.model';
import { RecipesFilterService } from '../recipes-filter.service';
import { RecipesService } from '../recipes.service';

export const Recipes_Base = 'recipes-base';
export const My_Recipes = 'my-recipes';
export const Community_Recipes = 'community-recipes';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit{
  recipes: Recipe[] | undefined;

  recipesType: string = '';
  sorting: boolean = false;
  filtering: boolean = false;
  loading: boolean = true;

  filterForm = new FormGroup({
    name: new FormControl(''),
    prepTime: new FormControl(''),
    difficulty: new FormControl(''),
    price: new FormControl(''),
  });

  sortForm = new FormGroup({
    sort: new FormControl(''),
  });

  constructor (
    private recipesService: RecipesService,
    private recipesFilterService: RecipesFilterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.recipesService.recipesChanged.subscribe(() => {
      this.recipes = this._getRecipes();
      this.loading = false;
    })

    this.route.params.subscribe((params) => {
      this.loading = true;
      this.recipesType = params['recipes'];
      this._fetchRecipes();
      this.filtering = false;
      this.sorting = false;

    });
  }

  onFilterClick(): void {
    const name = this.filterForm.controls.name.value;
    const prepTime = this.filterForm.controls.prepTime.value;
    const difficulty = this.filterForm.controls.difficulty.value;
    const price = this.filterForm.controls.price.value;

    this.recipes = this.recipesFilterService.filter(this.recipesType, name, prepTime, difficulty, price);
    this.filtering = true;
  }

  onClearFiltersClick(): void {
    this.filterForm.reset();
    this.onFilterClick();
    this.filtering = false;
  }

  onSortClick(): void {
    this.recipes = this.recipesFilterService.sort(this.recipes!, this.sortForm.controls.sort.value!);
    this.sorting = true;
  }

  onClearSortClick(): void {
    this.sortForm.reset();
    if(this.filtering) {
      this.onFilterClick();
    } else {
      this.recipes = this._getRecipes();
    }
    this.sorting = false;
  }

  private _getRecipes(): Recipe[] {
    let recipes: Recipe[] = [];
    if(this.recipesType === Recipes_Base) recipes = this.recipesService.recipesBase.slice();
    if(this.recipesType === My_Recipes) recipes = this.recipesService.userRecipes.slice();
    if(this.recipesType === Community_Recipes) recipes = this.recipesService.communityRecipes.slice();
    return recipes;
  }

  private _fetchRecipes(): void {
    if(this.recipesType === Recipes_Base)  this.recipesService.fetchRecipesBase();
    if(this.recipesType === My_Recipes)  this.recipesService.fetchUserRecipes();
    // if(this.recipesType === Community_Recipes)  this.recipesService.fetchCommunityRecipes();
  }
}
