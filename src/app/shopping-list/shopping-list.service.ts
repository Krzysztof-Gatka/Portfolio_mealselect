import { Injectable } from "@angular/core";
import { Subject } from 'rxjs'

import { Product } from "./shopping-list-element/product.model";

@Injectable({providedIn: 'root'})
export class ShoppingListService {
  private shoppingListElements: Product[] = [
    new Product('pasta', 500, 'g'),
    new Product('onion', 3, 'pc'),
    new Product('chicken breast', 500, 'g'),
  ];
  productDeleted = new Subject();

  getShoppingListElements(): Product[] {
    return this.shoppingListElements.slice();
  }

  addElement(product: Product): Product[] {
    this.shoppingListElements.push(product);
    return this.shoppingListElements;
  }

  deleteElement(index: number): void {
    this.shoppingListElements = this.shoppingListElements.filter((element, i) => i !== index);
    this.productDeleted.next('');
  }
}
