import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../recipe/recipe.model';
import { PantryService } from 'src/app/pantry/pantry.service';
import { RecipesService } from '../../recipes.service';

@Component({
  selector: 'app-recipes-list-element',
  templateUrl: './recipes-list-element.component.html',
  styleUrls: ['./recipes-list-element.component.scss']
})
export class RecipesListElementComponent implements OnInit{
  @Input() recipe!: Recipe;
  @Input() recipesType: string = ''

  ingsInPantry: number = 0;
  details: boolean = false;

  constructor(
    private pantryService: PantryService,
    private recipesService: RecipesService
  ) {}

  ngOnInit(): void {
    if(!this.pantryService.pantryFetched) {
      this.pantryService.fetchPantry();
    }
    const pantry = this.pantryService.getPantry();
    this.recipe.ingredients = this.recipe.ingredients.map((ingredient) => {
      const ingInPantry = pantry.find(product => product.name === ingredient.name)
      if (ingInPantry?.quantity! >= ingredient.quantity!) {
        ingredient.bought = true
        this.ingsInPantry++;
      }
      return ingredient;
    });

    // this.recipesService.updateRecipe(this.recipe);
  }

  onMoreBtnClick():void {
    this.details = !this.details;
  }
}
