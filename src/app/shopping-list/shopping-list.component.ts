import { Component, OnDestroy, OnInit } from '@angular/core';

import { ShoppingListService } from './shopping-list.service';
import { Product } from './shopping-list-element/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  shoppingListElements: Product[] | undefined;
  deletedProductsAvailable: boolean = false;
  modalOpened: boolean = false;
  loading: boolean = true;
  sub: Subscription | undefined;
  sub2: Subscription | undefined;
  fetchSub: Subscription | undefined;
  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.fetchSub = this.shoppingListService.productsFetched.subscribe(()=> {
      this.loading = false;
      this.shoppingListElements = this.shoppingListService.getShoppingListElements();
    })
    this.shoppingListService.fetchShoppingList();
    this.shoppingListElements = this.shoppingListService.getShoppingListElements();
    this.sub = this.shoppingListService.productsChanged.subscribe(()=> {
      this.shoppingListElements = this.shoppingListService.getShoppingListElements();
    })
    this.sub2 = this.shoppingListService.deletedProducts.subscribe((code) => {
      if(code === -1) {
        this.deletedProductsAvailable = false;
      } else {
        this.deletedProductsAvailable = true;

      }
    })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.sub2?.unsubscribe();
    this.fetchSub?.unsubscribe();
  }

  onItemAdded(product: Product): void {
    this.shoppingListElements = this.shoppingListService.addElement(product);
  }

  onReviveLastProduct(): void {
    this.shoppingListElements = this.shoppingListService.reviveLastProduct();
  }

  onClearList(): void {
    this.modalOpened = true;
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
