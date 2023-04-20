import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { RecipesService } from './recipes/recipes.service';
import { PantryService } from './pantry/pantry.service';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  pantrySub: Subscription | undefined;
  authSub: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private recipesService: RecipesService,
    private pantryService: PantryService,
    private shoppingListService: ShoppingListService,
  ) {}

  ngOnInit(): void {
    this.authService.autologin();
    this.authSub = this.authService.userAuthentication.subscribe(operation => {
      if(operation === 'logOut') {
        this.recipesService.recipesBaseFetched = false;
        this.recipesService.userRecipesFetched = false;
        this.pantryService.pantryFetched = false;
        this.shoppingListService.productsFetched = false;
      }
    });

    this.pantrySub = this.pantryService.pantryChanged.subscribe(()=> {
      this.recipesService.updateInPantry();
    })
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.pantrySub?.unsubscribe();
  }
}
