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
import { animate, keyframes, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.scss'],
  animations: [
    trigger('added', [

      transition(':enter', [

        animate('800ms ease-in-out', keyframes([

          style({
            opacity: 0,
            transform: 'translateY(-100%)'
          }),

          style({
            opacity: 1,
            transform: 'translateY(0)'
         }),

        ]))
      ]),

      transition(':leave', [

        animate('800ms ease-in-out',keyframes([

          style({
            opacity: 1,
          }),

          style({
            opacity: 0,
          }),

          style({
            height: 0,
            padding: 0,
         }),
        ]))
      ]),
    ]),


  ]
})
export class NewRecipeComponent implements OnInit{
  recipeForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    prepTime: new FormControl<number | null>(null, [Validators.required]),
    difficulty: new FormControl<string | null>(null, Validators.required),
    servings: new FormControl<number | null>(null, [Validators.required]),
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
  @ViewChild('tag_input') tagInput?: ElementRef<HTMLInputElement>;
  @ViewChild('ings_list') ingsList? : ElementRef<HTMLElement>;
  @ViewChild('steps_list') stepsList? : ElementRef<HTMLElement>;
  @ViewChild('tags_list') tagsList? : ElementRef<HTMLElement>;
  paramsSub: Subscription | undefined;
  editMode: boolean = false;
  btnsOpened: { id: number, open: boolean} | undefined;

  stepTitles = [
    'Basic Attributes',
    'Ingredients',
    'Preparation Steps',
    'Tags',
    'Recipe Preview'
 ];

  progress: number = 0;
  editingIngIndex: number = -1;
  editingStepIndex: number = -1;
  editingTagIndex: number = -1;
  movingForwards: boolean = false;
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
    const productQuantity = this.ingredientForm.controls.productQuantity.value;
    const productUnit = this.ingredientForm.controls.productUnit.value;

    this.recipe.ingredients.push(new Ingredient(productName, productQuantity, productUnit));
    this.ingredientForm.reset();
    this.ingNameInpt?.nativeElement.focus();

    setTimeout(()=> {
      this.ingsList?.nativeElement.scroll({
        top:this.ingsList.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    },0);

  }

  onAddStep(): void {
    const step = this.stepForm.controls.step.value!;

    this.recipe.prepSteps.push(step);
    this.stepForm.reset();

    this.stepInput?.nativeElement.focus();

    setTimeout(()=> {
      this.stepsList?.nativeElement.scroll({
        top:this.stepsList.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    },0);
  }

  _getFormRecipe(): void {
    const name = this.recipeForm.controls.name.value!;
    const prepTime = this.recipeForm.controls.prepTime.value!;
    const difficulty = this.recipeForm.controls.difficulty.value!;
    const servings = this.recipeForm.controls.servings.value!;
    if(this.recipeForm.controls.description.value) {
      this.recipe.description =  this.recipeForm.controls.description.value;
    }

    this.recipe.name = name;
    this.recipe.prepTime = prepTime;
    this.recipe.difficulty = difficulty;
    this.recipe.servings = servings;
  }

  onAddRecipe(): void {
    this.recipesService.addRecipe(this.recipe);
    this.router.navigate(['recipes']);
    this.recipeForm.reset();
  }

  onDeleteIngClick(index: number): void {
    this.recipe.ingredients = this.recipe.ingredients.filter((_, i) => i !== index);
    this.btnsOpened!.open = false;
  }

  onDeleteStepClick(index: number): void {
    this.recipe.prepSteps = this.recipe.prepSteps.filter((_, i) => i !== index);
    this.btnsOpened!.open = false;
  }

  onDeleteTagClick(index: number): void {
    this.recipe.tags = this.recipe.tags.filter((_, i) => i !== index);
    this.btnsOpened!.open = false;
  }

  onEditIngClick(index: number): void {
    const editedIng = this.recipe.ingredients[index];
    this.ingredientForm.controls.productName.setValue(editedIng.name);
    if(editedIng.quantity) this.ingredientForm.controls.productQuantity.setValue(editedIng.quantity);
    if(editedIng.unit) this.ingredientForm.controls.productUnit.setValue(editedIng.unit);

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

  onSaveIngChangesClick(): void {
    const productName = this.ingredientForm.controls.productName.value!;
    const productQuantity = this.ingredientForm.controls.productQuantity.value;
    const productUnit = this.ingredientForm.controls.productUnit.value;

    this.recipe.ingredients[this.editingIngIndex] = new Ingredient(productName, productQuantity, productUnit);
    this.editingIngIndex = -1;
    this.btnsOpened!.open = false;
    this.ingredientForm.reset();
    this.ingNameInpt?.nativeElement.focus();
  }

  onSaveStepChangesClick(): void {
    const step = this.stepForm.controls.step.value!;
    this.recipe.prepSteps[this.editingStepIndex] = step;
    this.editingStepIndex = -1;
    this.btnsOpened!.open = false;
    this.stepForm.reset();
    this.stepInput?.nativeElement.focus();
  }

  onSaveTagChangesClick(): void {
    const tag = this.tagsForm.controls.tag.value!;
    this.recipe.tags[this.editingTagIndex] = tag;
    this.editingTagIndex = -1;
    this.btnsOpened!.open = false;
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
    this.tagInput?.nativeElement.focus();
    setTimeout(()=> {
      this.tagsList?.nativeElement.scroll({
        top:this.tagsList.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    },0);
  }

  onNextClick(): void {
    if(this.progress === 0) {
      this._getFormRecipe();
    }

    if(this.btnsOpened) {
      this.btnsOpened.open = false;
    }
    this.progress = this.progress + 1;
    if(!this.editMode) this.movingForwards = true;
  }

  onBackClick(): void {
    this.progress = this.progress - 1;
    this.movingForwards = false;
  }

  onMoreClick(id: number): void {
    if(this.btnsOpened) {
      if(this.btnsOpened.id === id) {
        this.btnsOpened.open = !this.btnsOpened.open;
      } else {
        this.btnsOpened.id = id;
        this.btnsOpened.open = true;
      }
    } else {
      this.btnsOpened = { id: id, open: true};
    }
  }

}
