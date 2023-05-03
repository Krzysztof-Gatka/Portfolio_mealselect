import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipe/recipe.model';
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

  recipesType: string = '';
  loading: boolean = true;
  filterSortMenuOpened: boolean = false;
  sorting: {type: string, asc: boolean} = {type: 'none', asc: false};

  searchForm = new FormGroup({
    search: new FormControl(''),
  })

  sliderForm = new FormGroup({
    time: new FormControl(''),
  })

  constructor (
    private recipesService: RecipesService,
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
      if((this.recipesType === User_Recipes && this.recipesService.userRecipesFetched) || (this.recipesType === Recipes_Base && this.recipesService.recipesBaseFetched)) {
        this.recipes = this.recipesService.getRecipes(this.recipesType);
        this.loading = false;
      } else {
        this.recipesService.fetchRecipes(this.recipesType);
      }
    });

    this.searchForm.controls.search.valueChanges.subscribe((input) => {
      const searchWords = input?.split(" ").filter((word) => word !== '');

      if (searchWords && searchWords.length > 0) {
        this.loading = true;
        this.recipes = this.recipesService.filterSearch(searchWords, this.recipesType);
        console.log(this.recipes.length);
        this.loading = false;
      } else {
        this.recipesService.fetchRecipes(this.recipesType);
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
    if(this.sorting.type === type) {
      this.sorting.asc = !this.sorting.asc;
    } else {
      this.sorting.type = type;
      this.sorting.asc = true;
    }
  }

  onApplyClick(): void {
    this.filterSortMenuOpened = false;
  }
}
