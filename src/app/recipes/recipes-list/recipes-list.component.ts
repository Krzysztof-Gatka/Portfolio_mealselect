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

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.recipes = this.recipesService.recipesBase
  }

  onSubmit(): void {
    console.log(this.filterForm.controls.name.value);
    this.filterForm.reset();
  }
}
