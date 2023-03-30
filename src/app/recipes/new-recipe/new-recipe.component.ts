import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Product } from 'src/app/shopping-list/shopping-list-element/product.model';
import { Recipe } from '../recipe/recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.scss']
})
export class NewRecipeComponent {
  ingredientForm =  new FormGroup({
    productName: new FormControl(''),
    productQuantity: new FormControl(''),
    productUnit: new FormControl(''),
  });

  stepForm =  new FormGroup({
    step: new FormControl(''),
  });

  recipeForm = new FormGroup({
    name: new FormControl(''),
    prepTime: new FormControl(''),
    difficulty: new FormControl(''),
    servings: new FormControl(''),
    pricePerServing: new FormControl(''),
  })

  recipe: Recipe = new Recipe(
    new Date().getTime(),
    'Name',
    [
    ],
    [
    ],
  )

  constructor(private recipesService: RecipesService) {}

  onAddIngredient(): void {
    const productName = this.ingredientForm.controls.productName.value!;
    const productQuantity = +this.ingredientForm.controls.productQuantity.value!;
    const productUnit = this.ingredientForm.controls.productUnit.value!;

    this.recipe.ingredients.push(new Product(productName, productQuantity, productUnit))
    this.ingredientForm.reset();
  }

  onAddStep(): void {
    const step = this.stepForm.controls.step.value!;

    this.recipe.prepSteps.push(step);
    this.stepForm.reset();
  }

  onAddRecipe(): void {
    const name = this.recipeForm.controls.name.value!;
    const prepTime = this.recipeForm.controls.prepTime.value!;
    const difficulty = this.recipeForm.controls.difficulty.value!;
    const servings = this.recipeForm.controls.servings.value!;
    const pricePerServing = this.recipeForm.controls.pricePerServing.value!;

    this.recipe.name = name;
    this.recipe.prepTime = prepTime;
    this.recipe.difficulty = difficulty;
    this.recipe.servings = +servings;
    this.recipe.pricePerServing = +pricePerServing;

    this.recipesService.addRecipeToDb(this.recipe);

    this.recipeForm.reset();
  }
}
