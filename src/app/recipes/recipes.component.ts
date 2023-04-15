import { Component, OnInit } from '@angular/core';
import { PantryService } from '../pantry/pantry.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit{

  constructor(private pantryService: PantryService) {}

  ngOnInit(): void {
    this.pantryService.fetchPantry();
  }
}
