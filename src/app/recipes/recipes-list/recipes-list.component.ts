import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipe/recipe.model';
import { RecipesService } from '../recipes.service';
import { RecipesFilterService } from '../recipes-filter.service';

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

  recipesType: string = '';
  loading: boolean = true;
  filterSortMenuOpened: boolean = false;
  searchFiltering: boolean = false;

  searchForm = new FormGroup({
    search: new FormControl(''),
  })

  sliderForm = new FormGroup({
    time: new FormControl(''),
  })

  constructor (
    private route: ActivatedRoute,
    public recipesService: RecipesService,
    private recipesFilterService: RecipesFilterService,
  ) {}

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.loading = true;
      this.recipesType = params['recipes'];
      if((this.recipesType === User_Recipes && this.recipesService.userRecipesFetched) || (this.recipesType === Recipes_Base && this.recipesService.recipesBaseFetched)) {
        this.recipes = this.recipesService.getRecipes(this.recipesType);
        this.loading = false;
      } else {
        this.recipesService.fetchRecipes(this.recipesType);
      }
    });

    this.recipesService.recipesChanged.subscribe(() => {
      this.recipes = this.recipesService.getRecipes(this.recipesType);
      this.loading = false;
    });

    this.sliderForm.controls.time.valueChanges.subscribe(time => {
      if(time) this.recipesService.timeFilterValue = +time;
    })

    this.searchForm.controls.search.valueChanges.subscribe((input) => {
      const searchWords = input?.split(" ").filter(word => word !== '');
      if (searchWords && searchWords.length > 0) {
        this.loading = true;
        this.recipes = this.recipesService.filterSearch(searchWords, this.recipesType);
        this.searchFiltering = true;
        this.loading = false;
      } else {
        this.recipes = this.recipesService.getRecipes(this.recipesType);
        this.searchFiltering = false;
      }
    })
  }

  onFilterButtonClick() {
    this.filterSortMenuOpened = !this.filterSortMenuOpened;
  }

  onCloseFilterSortMenu() {
    this.filterSortMenuOpened = false;
  }

  onSortByBtnClick(type: string): void {
    this.recipesService.sorting.active = true;
    if(this.recipesService.sorting.type === type) {
      this.recipesService.sorting.asc = !this.recipesService.sorting.asc;
    } else {
      this.recipesService.sorting.type = type;
      this.recipesService.sorting.asc = true;
    }
  }

  onApplyClick(): void {
    this.filterSortMenuOpened = false;
    this.recipesService.sorting.active = true;
    if(this.recipes) this.recipes = this.recipesService.getRecipes(this.recipesType);
  }

  onClearClick(): void {
    this.recipesService.sorting.active = false;
    this.recipesService.sorting.type = 'none';

    this.recipesService.timeFilterValue = -1;
    this.sliderForm.reset();
  }
}
