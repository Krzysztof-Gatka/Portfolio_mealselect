import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Recipe } from '../recipe/recipe.model';
import { RecipesService } from '../recipes.service';
import { units } from '../recipe/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User_Recipes } from '../recipes-list/recipes-list.component';
import { Ingredient } from '../recipe/ingredient.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.scss']
})
export class NewRecipeComponent implements OnInit{
  recipeForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    prepTime: new FormControl<number | null>(null, Validators.required),
    difficulty: new FormControl<string | null>(null, Validators.required),
    servings: new FormControl<number | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
  });

  ingredientForm =  new FormGroup({
    productName: new FormControl<string | null>(null, Validators.required),
    productQuantity: new FormControl<number | null>(null),
    productUnit: new FormControl<string | null>(null),
  });

  stepForm =  new FormGroup({
    step: new FormControl<string | null>('', Validators.required),
  });

  tagsForm = new FormGroup ({
    tag: new FormControl<string | null>(null, Validators.required),
  })

  @ViewChild('ing_name_input') ingNameInpt?: ElementRef<HTMLInputElement>;
  @ViewChild('step_input') stepInput?: ElementRef<HTMLInputElement>;
  paramsSub: Subscription | undefined;
  editMode: boolean = false;
  moreMenu: { id: number, open: boolean} | undefined;

  stepTitles = [
    'Basic Attributes',
    'Ingredients',
    'Preparation Steps',
    'Tags',
 ];

  progress: number = 0;
  editingIngIndex: number = -1;
  editingStepIndex: number = -1;
  editingTagIndex: number = -1;
  units = units;
  recipe: Recipe = new Recipe(this.authService.user!.email + new Date().getTime().toString(), '', [], []);

  constructor(
    private recipesService: RecipesService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe((params) => {
      if(params['id']) {
        this.editMode = true;
        const recipe = this.recipesService.getRecipes(User_Recipes).filter((recipe) => params['id'] == recipe.id);
        this.recipe = recipe[0];
      }
    });
    if(this.editMode) this.loadRecipe();
  }

  loadRecipe(): void {
    this.recipeForm.controls.name.setValue(this.recipe.name);
    this.recipeForm.controls.servings.setValue(this.recipe.servings);
    this.recipeForm.controls.prepTime.setValue(this.recipe.prepTime);
    this.recipeForm.controls.difficulty.setValue(this.recipe.difficulty);
    if(this.recipe.description) {
      this.recipeForm.controls.description.setValue(this.recipe.description);
    }
  }

  onAddIngredient(): void {
    const productName = this.ingredientForm.controls.productName.value!;
    const productQuantity = +this.ingredientForm.controls.productQuantity.value!;
    const productUnit = this.ingredientForm.controls.productUnit.value!;

    this.recipe.ingredients.push(new Ingredient(productName, productQuantity, productUnit));
    this.ingredientForm.reset();
    this.ingNameInpt?.nativeElement.focus();
  }

  onAddStep(): void {
    const step = this.stepForm.controls.step.value!;

    this.recipe.prepSteps.push(step);
    this.stepForm.reset();

    this.stepInput?.nativeElement.focus();
  }

  _getFormRecipe(): void {
    const name = this.recipeForm.controls.name.value!;
    const prepTime = this.recipeForm.controls.prepTime.value!;
    const difficulty = this.recipeForm.controls.difficulty.value!;
    const servings = this.recipeForm.controls.servings.value!;
    if(this.recipeForm.controls.description.value) {
      this.recipe.description =  this.recipeForm.controls.description.value!;
    }

    this.recipe.name = name;
    this.recipe.prepTime = prepTime;
    this.recipe.difficulty = difficulty;
    this.recipe.servings = +servings;
  }

  onAddRecipe(): void {
    this.recipesService.addRecipe(this.recipe);
    this.router.navigate(['recipes']);
    this.recipeForm.reset();
  }

  onDeleteIngClick(index: number): void {
    this.recipe.ingredients = this.recipe.ingredients.filter((recipe, i) => i !== index);
  }

  onDeleteStepClick(index: number): void {
    this.recipe.prepSteps = this.recipe.prepSteps.filter((recipe, i) => i !== index);
  }

  onDeleteTagClick(index: number): void {
    this.recipe.tags = this.recipe.tags.filter((recipe, i) => i !== index);
  }

  onEditIngClick(index: number): void {
    const editedIng = this.recipe.ingredients[index];
    this.ingredientForm.controls.productName.setValue(editedIng.name);
    this.ingredientForm.controls.productQuantity.setValue(editedIng.quantity!);
    this.ingredientForm.controls.productUnit.setValue(editedIng.unit!);

    this.editingIngIndex = index;
    this.ingNameInpt?.nativeElement.focus();
  }

  onEditStepClick(index: number): void {
    const editedStep = this.recipe.prepSteps[index];

    this.stepForm.controls.step.setValue(editedStep);

    this.editingStepIndex = index;
    this.stepInput?.nativeElement.focus();
  }

  onEditTagClick(index: number) :void {
    const editedTag = this.recipe.tags[index];

    this.tagsForm.controls.tag.setValue(editedTag);

    this.editingTagIndex = index;
  }

  onSaveChangesClick(): void {
    const productName = this.ingredientForm.controls.productName.value!;
    const productQuantity = +this.ingredientForm.controls.productQuantity.value!;
    const productUnit = this.ingredientForm.controls.productUnit.value!;

    this.recipe.ingredients[this.editingIngIndex] = new Ingredient(productName, productQuantity, productUnit);
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

  onSaveTagChangesClick(): void {
    const tag = this.tagsForm.controls.tag.value!;
    this.recipe.tags[this.editingTagIndex] = tag;
    this.editingTagIndex = -1;
    this.stepForm.reset();
  }

  onSaveChanges(recipe: Recipe): void {
    this.recipesService.updateRecipe(recipe);
    this.router.navigate(['recipes']);
  }

  onAddTagClick(): void {
    const tag = this.tagsForm.controls.tag.value!;
    this.tagsForm.controls.tag.reset();
    if (this.recipe.tags) {
      this.recipe.tags.push(tag);
    } else {
      this.recipe.tags = [tag];
    }
  }

  onNextClick(): void {
    if(this.progress === 0) {
      this._getFormRecipe();
    }

    if(this.moreMenu) {
      this.moreMenu.open = false;
    }
    this.progress = this.progress + 1;
  }

  onBackClick(): void {
    this.progress = this.progress - 1;
  }

  onMoreClick(list: string, id: number): void {
    if(this.moreMenu) {
      if(this.moreMenu.id === id) {
        this.moreMenu.open = !this.moreMenu.open;
      } else {
        this.moreMenu.id = id;
        this.moreMenu.open = true;
      }
    } else {
      this.moreMenu = { id: id, open: true};
    }
  }

}
