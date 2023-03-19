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

  productsChanged = new Subject();
  productSaved = new Subject<number>();
  productBeingEdited = new Subject<number>();
  deletedProducts = new Subject<number>();
  deletedProductsStack: Product[] = [];

  getShoppingListElements(): Product[] {
    return this.shoppingListElements.slice();
  }

  addElement(product: Product): Product[] {
    this.shoppingListElements.push(product);
    return this.shoppingListElements.slice();
  }

  deleteElement(index: number): void {
    this.shoppingListElements = this.shoppingListElements.filter((element, i) =>{ if(i === index){
        this.deletedProductsStack.push(element);
        if(this.deletedProductsStack.length === 1) {
          this.deletedProducts.next(1);
        }
    }
    return i !==index
  });
    this.productsChanged.next('');
  }

  updateElement(index: number, product: Product): void {
    this.shoppingListElements = this.shoppingListElements.map((prod, i)=> {
      if (i === index) return product;
      return prod;
    });
    this.productsChanged.next('');
  }

  clear() :void {
    this.shoppingListElements = [];
  }

  private _getLastDeletedProduct(): Product | undefined {
    return this.deletedProductsStack.pop()
  }

  reviveLastProduct(): Product[] {
    const deletedProduct = this._getLastDeletedProduct()
    if(this.deletedProductsStack.length === 0) this.deletedProducts.next(-1);
    if(!deletedProduct) return this.shoppingListElements;
    return this.addElement(deletedProduct);
  }
}
