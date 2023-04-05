import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/shopping-list/shopping-list-element/product.model';
import { Recipe } from '../recipe/recipe.model';
import { RecipesService } from '../recipes.service';
import { units } from '../recipe/recipe.model';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.scss']
})
export class NewRecipeComponent {
  ingredientForm =  new FormGroup({
    productName: new FormControl('', Validators.required),
    productQuantity: new FormControl(''),
    productUnit: new FormControl(''),
  });

  stepForm =  new FormGroup({
    step: new FormControl('', Validators.required),
  });

  recipeForm = new FormGroup({
    name: new FormControl(''),
    prepTime: new FormControl(''),
    difficulty: new FormControl(''),
    servings: new FormControl(''),
    pricePerServing: new FormControl(''),
    description: new FormControl(''),
  })

  @ViewChild('ing_name_input') ingNameInpt?: ElementRef<HTMLInputElement>;
  @ViewChild('step_input') stepInput?: ElementRef<HTMLInputElement>;
  editingIngIndex: number = -1;
  editingStepIndex: number = -1;
  units = units;
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
    this.ingNameInpt?.nativeElement.focus();
  }

  onAddStep(): void {
    const step = this.stepForm.controls.step.value!;

    this.recipe.prepSteps.push(step);
    this.stepForm.reset();

    this.stepInput?.nativeElement.focus();
  }

  onAddRecipe(): void {
    const name = this.recipeForm.controls.name.value!;
    const prepTime = this.recipeForm.controls.prepTime.value!;
    const difficulty = this.recipeForm.controls.difficulty.value!;
    const servings = this.recipeForm.controls.servings.value!;
    const pricePerServing = this.recipeForm.controls.pricePerServing.value!;
    const description = this.recipeForm.controls.description.value!;

    this.recipe.name = name;
    this.recipe.prepTime = prepTime;
    this.recipe.difficulty = difficulty;
    this.recipe.servings = +servings;
    this.recipe.pricePerServing = +pricePerServing;
    this.recipe.description = description;

    this.recipesService.addRecipe(this.recipe);

    this.recipeForm.reset();
  }

  onDeleteIngClick(index: number): void {
    this.recipe.ingredients = this.recipe.ingredients.filter((recipe, i) => i !== index);
  }

  onDeleteStepClick(index: number): void {
    this.recipe.prepSteps = this.recipe.prepSteps.filter((recipe, i) => i !== index);
  }

  onEditIngClick(index: number): void {
    const editedIng = this.recipe.ingredients[index];
    this.ingredientForm.controls.productName.setValue(editedIng.name);
    this.ingredientForm.controls.productQuantity.setValue(editedIng.quantity.toString())
    this.ingredientForm.controls.productUnit.setValue(editedIng.unit);

    this.editingIngIndex = index;
    this.ingNameInpt?.nativeElement.focus();
  }

  onEditStepClick(index: number): void {
    const editedStep = this.recipe.prepSteps[index];

    this.stepForm.controls.step.setValue(editedStep);

    this.editingStepIndex = index;
    this.stepInput?.nativeElement.focus();
  }

  onSaveChangesClick(): void {
    const productName = this.ingredientForm.controls.productName.value!;
    const productQuantity = +this.ingredientForm.controls.productQuantity.value!;
    const productUnit = this.ingredientForm.controls.productUnit.value!;

    this.recipe.ingredients[this.editingIngIndex] = new Product(productName, productQuantity, productUnit);
    this.editingIngIndex = -1;
    this.ingredientForm.reset();
    this.ingNameInpt?.nativeElement.focus();
  }

  onSaveStepChangesClick(): void {
    const step = this.stepForm.controls.step.value!;
    this.recipe.prepSteps[this.editingStepIndex] = step;
    this.editingStepIndex = -1;
    this.stepForm.reset();
    this.stepInput?.nativeElement.focus();
  }
}
