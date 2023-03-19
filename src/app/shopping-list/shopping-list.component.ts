import { Component, OnInit } from '@angular/core';

import { ShoppingListService } from './shopping-list.service';
import { Product } from './shopping-list-element/product.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  shoppingListElements: Product[] | undefined;
  addProduct: boolean = false;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.shoppingListElements = this.shoppingListService.getShoppingListElements();
  }

  onAddButtonClick(): void {
    this.addProduct = true;
  }
}
