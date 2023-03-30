import { Component, Input } from '@angular/core';
import { Recipe } from '../../recipe/recipe.model';

@Component({
  selector: 'app-recipes-list-element',
  templateUrl: './recipes-list-element.component.html',
  styleUrls: ['./recipes-list-element.component.scss']
})
export class RecipesListElementComponent {
  @Input() recipe!: Recipe;
  @Input() recipesType: string = ''
}
