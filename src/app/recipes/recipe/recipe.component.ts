import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';

import { RecipesService } from '../recipes.service';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit, OnDestroy{
  @Input() recipe: Recipe | undefined;
  recipesType: string = '';
  sub: Subscription | undefined;
  buttons: boolean = false;
  recipePreview: boolean = false;
  constructor(
    private recipesService: RecipesService,
    private route: ActivatedRoute,
    private shoppingListService: ShoppingListService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    if(this.recipe === undefined) {
      this.sub = this.route.params.subscribe((params) => {
        this.recipesType = params['recipes'];
        this.recipe = this.recipesService.getRecipes(this.recipesType).filter(recipe => recipe.id == params['id'])[0];
      });
    } else {
      this.recipePreview = true;
    }

  }

  ngOnDestroy(): void {
      this.sub?.unsubscribe();
  }

  onAddToShoppingListClick(): void {
    this.shoppingListService.addProducts(this.recipe!.ingredients);
    this.buttons = false;
  }

  onAddToMyRecipes() :void{
    this.recipesService.addRecipe(this.recipe!);
    this.buttons = false;
  }

  onDeleteRecipeClick(id: string): void {
    this.recipesService.deleteRecipe(id);
    this.buttons = false;
  }

  onEditRecipeClick(id: number) :void{

  }

  onMoreButtonClick() {
    this.buttons = !this.buttons;
  }
}
