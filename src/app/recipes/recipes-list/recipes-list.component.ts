import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Recipe } from '../recipe/recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit{
  recipes: Recipe[] | undefined;
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
    this.recipes = this.recipesService.recipesBase
  }

  onSubmit(): void {

  }

  onFilterClick(): void {
    const name = this.filterForm.controls.name.value;
    const prepTime = this.filterForm.controls.prepTime.value;
    const difficulty = this.filterForm.controls.difficulty.value;
    const price = this.filterForm.controls.price.value;
    this.recipes = this.recipesService.filter(name, prepTime, difficulty, price);
  }

  onClearFiltersClick(): void {
    this.filterForm.reset();
    this.onFilterClick();
  }

  onSortClick(): void {
    this.recipes = this.recipesService.sort(this.sortForm.controls.sort.value!);
  }

  onClearSortClick(): void {
    this.sortForm.reset();
    this.recipes = this.recipesService.recipesBase.slice();
  }
}
