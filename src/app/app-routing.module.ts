import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";

import { canActivateUser } from "./auth/auth.service";
import { PantryComponent } from "./pantry/pantry.component";
import { NewRecipeComponent } from "./recipes/new-recipe/new-recipe.component";
import { RecipeComponent } from "./recipes/recipe/recipe.component";
import { RecipesListComponent } from "./recipes/recipes-list/recipes-list.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { WelcomeComponent } from "./welcome/welcome.component";

const ROUTES: Route[] = [
  { path: '', component: WelcomeComponent, pathMatch: "full" },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'register', component: AuthComponent },
  { path: 'login', component: AuthComponent },
  { path: 'shopping-list', component: ShoppingListComponent, canActivate: [canActivateUser] },
  { path: 'new-recipe', component: NewRecipeComponent },
  { path: 'edit-recipe/:id', component: NewRecipeComponent },
  { path: 'pantry', component: PantryComponent },
  {
    path: 'recipes',
    component: RecipesComponent,
    children: [
      {
        path: '', redirectTo: 'recipes-list/user-recipes', pathMatch: 'full',
      },
      {
        path: 'recipes-list/:recipes', component: RecipesListComponent,
      },
      {
        path: ':recipes/recipe/:id', component: RecipeComponent,
      },

    ],
    canActivate: [canActivateUser]
  },
]

@NgModule({
  imports:[RouterModule.forRoot(ROUTES)],
  exports:[RouterModule]
})
export class AppRoutingModule {

}
