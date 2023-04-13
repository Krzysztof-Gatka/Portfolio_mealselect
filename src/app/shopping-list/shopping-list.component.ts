import { Component, OnDestroy, OnInit } from '@angular/core';

import { ShoppingListService } from './shopping-list.service';
import { Product } from './shopping-list-element/product.model';
import { Subscription } from 'rxjs';
import { PantryService } from '../pantry/pantry.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  shoppingListElements: Product[] | undefined;
  deletedProductsAvailable: boolean = false;
  modalOpened: boolean = false;
  boughtElements: boolean = false;
  loading: boolean = true;
  sub: Subscription | undefined;
  sub2: Subscription | undefined;
  fetchSub: Subscription | undefined;
  constructor(private shoppingListService: ShoppingListService, private pantryServcie: PantryService) {}

  ngOnInit(): void {
    this.sub = this.shoppingListService.productsChanged.subscribe(()=> {
      this.loading = false;
      this.shoppingListElements = this.shoppingListService.getShoppingList();
      this.boughtElements = this.shoppingListService.getShoppingList().some(product => product.bought)
    });

    this.sub2 = this.shoppingListService.deletedProducts.subscribe((code) => {
      if(code === -1) {
        this.deletedProductsAvailable = false;
      } else {
        this.deletedProductsAvailable = true;
      }
    });

    this.shoppingListService.fetchShoppingList();
    this.shoppingListElements = this.shoppingListService.getShoppingList();

  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.sub2?.unsubscribe();
  }

  onItemAdded(product: Product): void {
    this.shoppingListElements = this.shoppingListService.addProduct(product);
  }

  onReviveLastProduct(): void {
    this.shoppingListElements = this.shoppingListService.reviveLastProduct();
  }

  onClearList(): void {
    this.modalOpened = true;
  }

  onClearBoughtElements():void {
    this.shoppingListService.clearBoughtProducts();
  }

  onAddBoughtElementsToPantry(): void {
    this.shoppingListElements?.filter((product) => product.bought).map((product) => this.pantryServcie.addElement(product));
    this.onClearBoughtElements();
  }

  //MODAL
  onModalClick(): void {
    this.modalOpened = false;
  }

  onYesClick(): void {
    this.shoppingListElements = [];
    this.shoppingListService.clear();
  }

}
