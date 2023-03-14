import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";

const ROUTES: Route[] = [
  { path: '', component: HomeComponent, pathMatch: "full" },
  { path: 'home', component: HomeComponent },
  { path: 'shopping-list', component: ShoppingListComponent },
]

@NgModule({
  imports:[RouterModule.forRoot(ROUTES)],
  exports:[RouterModule]
})
export class AppRoutingModule {

}
