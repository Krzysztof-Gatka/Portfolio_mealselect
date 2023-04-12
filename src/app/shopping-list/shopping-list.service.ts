import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs'
import { AuthService } from "../auth/auth.service";
import { Default_URL } from "../recipes/recipes.service";

import { Product } from "./shopping-list-element/product.model";

@Injectable({providedIn: 'root'})
export class ShoppingListService {
  shoppingListElements: Product[] = [];

  productsFetched = new Subject();
  productsChanged = new Subject();
  productSaved = new Subject<number>();
  productBeingEdited = new Subject<number>();
  deletedProducts = new Subject<number>();
  deletedProductsStack: Product[] = [];

  constructor(
    private http: HttpClient,
    private authServcie: AuthService,
  ) {}

  fetchShoppingList(): void {
    const user = this.authServcie.user!;
    const params = new HttpParams().set('auth', this.authServcie.user!.token);

    this.http.get<Product[]>(Default_URL + user.uid + '/shopping-list.json', { params: params})
      .subscribe((products)=> {
        this.shoppingListElements = products;
        this.productsFetched.next('');
      })
  }

  _putShoppingList(): void {
    const user = this.authServcie.user!;
    const params = new HttpParams().set('auth', this.authServcie.user!.token);

    this.http.put(Default_URL + user.uid + '/shopping-list.json', this.shoppingListElements ,{params: params}).subscribe();
  }

  getShoppingListElements(): Product[] {
    if(this.shoppingListElements !== null){
      return this.shoppingListElements.slice();
    }

    return [];
  }

  addElement(product: Product): Product[] {
    if(this.shoppingListElements === null) {
      this.shoppingListElements = [product];
    } else {

      this.shoppingListElements.push(product);
    }
    this._putShoppingList();
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
    this._putShoppingList();
    this.productsChanged.next('');
  }

  updateElement(index: number, product: Product): void {
    this.shoppingListElements = this.shoppingListElements.map((prod, i)=> {
      if (i === index) return product;
      return prod;
    });
    this._putShoppingList();
    this.productsChanged.next('');
  }

  clear() :void {
    this.shoppingListElements = [];
    this._putShoppingList();
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
