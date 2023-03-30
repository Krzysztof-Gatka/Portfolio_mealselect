import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Recipe } from '../recipe/recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit{
  @Input() recipes: Recipe[] | undefined;
  @Input() usersRecipes: boolean = false;
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

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    if(!this.usersRecipes) {
      this.recipesService.fetchRecipesBase();
      this.recipesService.recipesFetched.subscribe(() => {
        this.loading = false;
        this.recipes = this.recipesService.recipesBase.slice();
      })
    } else {
      this.loading = false;
    }
  }

  onSubmit(): void {

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
