import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingListElementComponent } from './shopping-list/shopping-list-element/shopping-list-element.component';
import { AuthComponent } from './auth/auth.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeComponent } from './recipes/recipe/recipe.component';
import { RecipesListComponent } from './recipes/recipes-list/recipes-list.component';
import { RecipesListElementComponent } from './recipes/recipes-list/recipes-list-element/recipes-list-element.component';
import { NavComponent } from './nav/nav.component';
import { NewRecipeComponent } from './recipes/new-recipe/new-recipe.component';
import { PantryComponent } from './pantry/pantry.component';
import { PantryElementComponent } from './pantry/pantry-element/pantry-element.component';

@NgModule({
  declarations: [
    AppComponent,
    ShoppingListComponent,
    ShoppingListElementComponent,
    AuthComponent,
    WelcomeComponent,
    RecipesComponent,
    RecipeComponent,
    RecipesListComponent,
    RecipesListElementComponent,
    NavComponent,
    NewRecipeComponent,
    PantryComponent,
    PantryElementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
