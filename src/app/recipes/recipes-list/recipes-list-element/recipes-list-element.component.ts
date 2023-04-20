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
    this.ingsInPantry = this.recipe.ingredients.filter(ing => ing.inPantry).length;
  }

  onMoreBtnClick():void {
    this.details = !this.details;
  }
}
