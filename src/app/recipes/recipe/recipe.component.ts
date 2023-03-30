import { Component, OnDestroy, OnInit } from '@angular/core';
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
  providers: [ToastrService],
})
export class RecipeComponent implements OnInit, OnDestroy{
  recipe: Recipe | undefined;
  sub: Subscription | undefined;
  constructor(
    private recipesService: RecipesService,
    private route: ActivatedRoute,
    private shoppingListService: ShoppingListService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.recipe = this.recipesService.recipesBase.slice().filter(recipe => recipe.id == params['id'])[0];
    })
  }

  ngOnDestroy(): void {
      this.sub?.unsubscribe();
  }

  onAddToShoppingListClick(): void {
    this.recipe?.ingredients.map((product) => {
      this.shoppingListService.addElement(product);
    })
    this.toastr.success('Successfully added ingredients to your Shopping List');
  }

  onAddToMyRecipes() :void{
    this.recipesService.addRecipeToDb(this.recipe!);
    this.toastr.success('Successfully added recipe to Your Recipes!');
  }
}
