import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, catchError, of } from 'rxjs'

import { AuthService } from "../auth/auth.service";
import { PantryService } from "../pantry/pantry.service";
import { Default_URL } from "../recipes/recipes.service";
import { ToastrService } from "ngx-toastr";
import { ShoppingListElement } from "./shopping-list-element/shopping-list-element.model";

@Injectable({providedIn: 'root'})
export class ShoppingListService {
  private shoppingListElements: ShoppingListElement[] | undefined;
  private deletedProductsStack: ShoppingListElement[] = [];

  productsFetched: boolean = false;
  error: boolean = false;

  productsChanged = new Subject();
  deletedProducts = new Subject<number>();

  productSaved = new Subject<number>();
  productBeingEdited = new Subject<number>();
  clickOutsideMoreMenu = new Subject<MouseEvent>();

  constructor(
    private http: HttpClient,
    private authServcie: AuthService,
    private pantryService: PantryService,
    private toastr: ToastrService,
  ) {}

  fetchShoppingList(): void {
    const user = this.authServcie.user!;
    const params = new HttpParams().set('auth', this.authServcie.user!.token);

    this.http.get<ShoppingListElement[]>(Default_URL + user.uid + '/shopping-list.json', { params: params})
      .pipe(
        catchError((error) => {
          console.warn(error);
          this.toastr.error('Error: Downloading of shopping list from server failed.');
          this.error = true;
          return of([]);
        }),
      )
      .subscribe((products)=> {
        this.shoppingListElements = products;
        if (!this.error) this.productsFetched = true;
        this.productsChanged.next('');
      });
  }

  clearBoughtProducts(): void {
    this.shoppingListElements = this.shoppingListElements?.filter((product) => !product.bought);
    this._putShoppingList();
    this.productsChanged.next('');
  }

  toggleBought(index: number): void {
    if(this.shoppingListElements![index].bought !== undefined) {
      this.shoppingListElements![index].bought = !this.shoppingListElements![index].bought;
    } else {
      this.shoppingListElements![index].bought = true;
    }
    this._putShoppingList();
    this.productsChanged.next('');
  }

  getShoppingList(): ShoppingListElement[] {
    if(this.shoppingListElements !== undefined && this.shoppingListElements !== null){
      return this.shoppingListElements!.slice();
    }
    return [];
  }

  addProduct(product: ShoppingListElement): ShoppingListElement[] {
    if(this.shoppingListElements === undefined || this.shoppingListElements === null) {
      this.shoppingListElements = [product];
    } else {
      this.shoppingListElements.push(product);
    }
    this._putShoppingList();
    this.productsChanged.next('');
    return this.shoppingListElements.slice();
  }

  deleteProduct(index: number): void {
    this.shoppingListElements = this.shoppingListElements!.filter((element, i) =>{ if(i === index){
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

  updateProduct(index: number, product: ShoppingListElement): void {
    this.shoppingListElements = this.shoppingListElements!.map((prod, i)=> {
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

  reviveLastProduct(): ShoppingListElement[] {
    const deletedProduct = this._getLastDeletedProduct()
    if(this.deletedProductsStack.length === 0) this.deletedProducts.next(-1);
    if(!deletedProduct) return this.shoppingListElements!;
    return this.addProduct(deletedProduct);
  }

  addBoughtElementsToPantry():void {
    this.shoppingListElements!
      .filter(product => product.bought)
      .map(product => this.pantryService.addElement(product));
  }

  private _putShoppingList(): void {
    const user = this.authServcie.user!;
    const params = new HttpParams().set('auth', this.authServcie.user!.token);

    this.http.put(Default_URL + user.uid + '/shopping-list.json', this.shoppingListElements ,{params: params}).subscribe();
  }

  private _getLastDeletedProduct(): ShoppingListElement | undefined {
    return this.deletedProductsStack.pop()
  }
}
