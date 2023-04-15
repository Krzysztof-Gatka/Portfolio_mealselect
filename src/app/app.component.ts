import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { RecipesService } from './recipes/recipes.service';
import { PantryService } from './pantry/pantry.service';
import { ShoppingListService } from './shopping-list/shopping-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private recipesService: RecipesService,
    private pantryService: PantryService,
    private shoppingListService: ShoppingListService,
  ) {}

  ngOnInit(): void {
    this.authService.autologin();
    this.authService.userAuthentication.subscribe(operation => {
      if(operation === 'logOut') {
        this.recipesService.recipesBaseFetched = false;
        this.recipesService.userRecipesFetched = false;
        this.pantryService.pantryFetched = false;
        this.shoppingListService.productsFetched = false;
      }
    });
  }
}
