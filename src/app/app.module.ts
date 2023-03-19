import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingListElementComponent } from './shopping-list/shopping-list-element/shopping-list-element.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShoppingListComponent,
    ShoppingListElementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
