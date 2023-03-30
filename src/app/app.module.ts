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
import { ShoppingListInputComponent } from './shopping-list/shopping-list-input/shopping-list-input.component';
import { AuthComponent } from './auth/auth.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeComponent } from './recipes/recipe/recipe.component';
import { RecipesListComponent } from './recipes/recipes-list/recipes-list.component';
import { RecipesListElementComponent } from './recipes/recipes-list/recipes-list-element/recipes-list-element.component';
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    ShoppingListComponent,
    ShoppingListElementComponent,
    ShoppingListInputComponent,
    AuthComponent,
    WelcomeComponent,
    RecipesComponent,
    RecipeComponent,
    RecipesListComponent,
    RecipesListElementComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
