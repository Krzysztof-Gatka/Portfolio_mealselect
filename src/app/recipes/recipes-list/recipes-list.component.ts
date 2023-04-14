import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipe/recipe.model';
import { RecipesFilterService } from '../recipes-filter.service';
import { RecipesService } from '../recipes.service';

export const Recipes_Base = 'recipes-base';
export const User_Recipes = 'user-recipes';
export const Community_Recipes = 'community-recipes';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit{
  recipes: Recipe[] | undefined;
  tags: string[] = [];

  recipesType: string = '';
  sorting: boolean = false;
  filtering: boolean = false;
  loading: boolean = true;

  filterForm = new FormGroup({
    name: new FormControl(''),
    prepTime: new FormControl(''),
    difficulty: new FormControl(''),
    price: new FormControl(''),
    tags: new FormControl(''),
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
      this.recipes = this.recipesService.getRecipes(this.recipesType);
      this.loading = false;
    })

    this.route.params.subscribe((params) => {
      this.loading = true;
      this.recipesType = params['recipes'];
      this.recipesService.fetchRecipes(this.recipesType);
      this.filtering = false;
      this.sorting = false;

    });
  }

  onFilterClick(): void {
    const name = this.filterForm.controls.name.value;
    const prepTime = this.filterForm.controls.prepTime.value;
    const difficulty = this.filterForm.controls.difficulty.value;
    const price = this.filterForm.controls.price.value;

    this.recipes = this.recipesFilterService.filter(this.recipesType, name, prepTime, difficulty, this.tags);
    this.filtering = true;
  }

  onClearFiltersClick(): void {
    this.filterForm.reset();
    this.tags = [];
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
      this.recipes = this.recipesService.getRecipes(this.recipesType);
    }
    this.sorting = false;
  }

  onAddTagClick(): void {
    if(this.tags) {
      this.tags.push(this.filterForm.controls.tags.value!)
    } else {
      this.tags = [this.filterForm.controls.tags.value!];
    }
    this.filterForm.controls.tags.reset();
  }

  onXClick(index: number):void {
    this.tags = this.tags!.filter((tag, i) => index !== i);
    this.onFilterClick();
  }
}
