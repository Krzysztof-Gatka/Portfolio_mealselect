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
  sub: Subscription | undefined;
  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.shoppingListElements = this.shoppingListService.getShoppingListElements();
    this.sub = this.shoppingListService.productsChanged.subscribe(()=> {
      this.shoppingListElements = this.shoppingListService.getShoppingListElements();
    })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  onItemAdded(product: Product): void {
    this.shoppingListElements = this.shoppingListService.addElement(product);
  }

  onReviveLastProduct(): void {
    if(this.shoppingListService.lastDeletedProduct) {
      this.shoppingListService.addElement(this.shoppingListService.lastDeletedProduct);
      this.shoppingListElements = this.shoppingListService.getShoppingListElements();
    }
  }

  onClearList(): void {
    this.shoppingListElements = [];
    this.shoppingListService.clear();
  }
}
