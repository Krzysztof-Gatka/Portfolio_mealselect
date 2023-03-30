import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";

import { canActivateUser } from "./auth/auth.service";
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
  {
    path: 'recipes',
    component: RecipesComponent,
    children: [
      {
        path: '', redirectTo: 'recipes-list/my-recipes', pathMatch: 'full',
      },
      {
        path: 'recipes-list/:recipes', component: RecipesListComponent,
      },
      {
        path: 'recipe/:id', component: RecipeComponent,
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
