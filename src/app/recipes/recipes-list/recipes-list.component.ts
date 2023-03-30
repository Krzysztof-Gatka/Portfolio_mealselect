import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipe/recipe.model';
import { RecipesService } from '../recipes.service';

const Recipes_Base = 'recipes-base';
const My_Recipes = 'my-recipes';
const Community_Recipes = 'community-recipes';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit{
  @Input() recipes: Recipe[] | undefined;
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

  constructor(private recipesService: RecipesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {

      this.loading = true;
      this.recipesType = params['recipes'];

      if(this.recipesType === Recipes_Base)  this.recipesService.fetchRecipesBase();
      if(this.recipesType === My_Recipes)  this.recipesService.fetchUserRecipes();
      // if(this.recipesType === Community_Recipes)  this.recipesService.fetchCommunityRecipes();
    });

    this.recipesService.recipesFetched.subscribe(() => {

      this.loading = false;

      if(this.recipesType === Recipes_Base) this.recipes = this.recipesService.recipesBase.slice();
      if(this.recipesType === My_Recipes) this.recipes = this.recipesService.userRecipes.slice();

      // if(this.recipesType === Community_Recipes) this.recipes = this.recipesService.communityRecipes.slice();
    })
  }

  onFilterClick(): void {
    const name = this.filterForm.controls.name.value;
    const prepTime = this.filterForm.controls.prepTime.value;
    const difficulty = this.filterForm.controls.difficulty.value;
    const price = this.filterForm.controls.price.value;
    this.recipes = this.recipesService.filter(name, prepTime, difficulty, price);
    this.filtering = true;
  }

  onClearFiltersClick(): void {
    this.filterForm.reset();
    this.onFilterClick();
    this.filtering = false;
  }

  onSortClick(): void {
    this.recipes = this.recipesService.sort(this.sortForm.controls.sort.value!);
    this.sorting = true;
  }

  onClearSortClick(): void {
    this.sortForm.reset();
    this.recipes = this.recipesService.recipesBase.slice();
    this.sorting = false;
  }
}
