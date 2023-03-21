import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";

import { HomeComponent } from "./home/home.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { WelcomeComponent } from "./welcome/welcome.component";

const ROUTES: Route[] = [
  { path: '', component: HomeComponent, pathMatch: "full" },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'register', component: AuthComponent },
  { path: 'login', component: AuthComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shopping-list', component: ShoppingListComponent },
]

@NgModule({
  imports:[RouterModule.forRoot(ROUTES)],
  exports:[RouterModule]
})
export class AppRoutingModule {

}
