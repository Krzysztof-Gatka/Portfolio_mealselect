import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ShoppingListService } from './shopping-list.service';
import { Product } from './shopping-list-element/product.model';

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

  changeSub: Subscription | undefined;
  deleteSub: Subscription | undefined;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.changeSub = this.shoppingListService.productsChanged.subscribe(()=> {
      this.loading = false;
      this.shoppingListElements = this.shoppingListService.getShoppingList();
      this.boughtElements = this.shoppingListService.getShoppingList().some(product => product.bought)
    });

    this.deleteSub = this.shoppingListService.deletedProducts.subscribe((code) => {
      if(code === -1) {
        this.deletedProductsAvailable = false;
      } else {
        this.deletedProductsAvailable = true;
      }
    });

    this.shoppingListService.fetchShoppingList();
  }

  ngOnDestroy(): void {
    this.changeSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }

  onItemAdded(product: Product): void {
    this.shoppingListElements = this.shoppingListService.addProduct(product);
  }

  onReviveLastProduct(): void {
    this.shoppingListElements = this.shoppingListService.reviveLastProduct();
  }

  onClearBoughtElements():void {
    this.shoppingListService.clearBoughtProducts();
  }

  onAddBoughtElementsToPantry(): void {
    this.shoppingListService.addBoughtElementsToPantry();
    this.onClearBoughtElements();
  }

  onClearList(): void {
    this.modalOpened = true;
  }

  onModalClick(): void {
    this.modalOpened = false;
  }

  onYesClick(): void {
    this.shoppingListElements = [];
    this.shoppingListService.clear();
  }
}
