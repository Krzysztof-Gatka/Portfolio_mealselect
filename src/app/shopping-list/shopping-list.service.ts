import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, of, retry } from 'rxjs'

import { AuthService } from "../auth/auth.service";
import { PantryService } from "../pantry/pantry.service";
import { Default_URL } from "../recipes/recipes.service";
import { ToastrService } from "ngx-toastr";
import { ShoppingListElement } from "./shopping-list-element/shopping-list-element.model";
import { Product } from "../recipes/recipe/product.model";
import { Router } from "@angular/router";

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
  shoppingListLoading = new Subject<boolean>();
  clickOutsideMoreMenu = new Subject<MouseEvent>();

  constructor(
    private http: HttpClient,
    private authServcie: AuthService,
    private pantryService: PantryService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  fetchShoppingList(): void {
    const user = this.authServcie.user!;
    const params = new HttpParams().set('auth', this.authServcie.user!.token);

    this.http.get<ShoppingListElement[]>(Default_URL + user.uid + '/shopping-list.json', { params: params})
      .pipe(
        retry({count: 3, delay:2000}),
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

  private _putShoppingList(shoppingList: ShoppingListElement[]): Observable<ShoppingListElement[]> {
    const user = this.authServcie.user!;
    const params = new HttpParams().set('auth', this.authServcie.user!.token);

    return this.http.put<ShoppingListElement[]>(Default_URL + user.uid + '/shopping-list.json', shoppingList ,{params: params})
      .pipe(
        retry({count: 3, delay: 2000}),
        catchError((error) => {
          console.warn(error);
          this.toastr.error('Error: Saving Shopping List on Server failed.');
          this.error = true;
          throw new Error(error);
        })
      )
  }

  addToShoppingList(products: ShoppingListElement[]): void {
    let updatedShoppingList: ShoppingListElement[] = [];

    if(this.shoppingListElements) {
      updatedShoppingList = [...this.shoppingListElements, ...products];
    } else {
      updatedShoppingList = [...products];
    }

    this._putShoppingList(updatedShoppingList).subscribe({
      next: () => {
        this.shoppingListElements = updatedShoppingList;
        this.productsChanged.next('');
        this.toastr.success('Successfully added ingredients to your Shopping List');
        this.router.navigate(['shopping-list']);
      },
      error: (error) => {
        this.toastr.error('Error: Ingredients could not be added to Shopping List.');
      },
    });
  }

  clearBoughtProducts(): void {
    const productsNotBought = this.shoppingListElements!.filter((product) => !product.bought);

    this._putShoppingList(productsNotBought).subscribe({
      next: () => {
        this.shoppingListElements = productsNotBought;
        this.productsChanged.next('');
      },
      error: (error) => {
        this.toastr.error('Error: Bought Products could not be removed from Shopping List.');
      },
    });
  }

  toggleBought(index: number): void {
    const shoppingListElements = this.getShoppingList();

    if(this.shoppingListElements![index].bought !== undefined) {
      shoppingListElements[index].bought = !shoppingListElements[index].bought;
    } else {
      shoppingListElements![index].bought = true;
    }

    this._putShoppingList(shoppingListElements).subscribe({
      next: () => {
        this.shoppingListElements = shoppingListElements;
        this.productsChanged.next('');
      },
      error: (error) => {
        this.toastr.error('Error: Data Changes could not be saved in DataBase.');
      },
    });
  }

  getShoppingList(): ShoppingListElement[] {
    if(this.shoppingListElements !== undefined && this.shoppingListElements !== null){
      return this.shoppingListElements!.slice();
    }
    return [];
  }

  addProduct(product: ShoppingListElement): void {
    let updatedShoppingList: ShoppingListElement[] = [];

    if(this.shoppingListElements) {
      updatedShoppingList = [...this.shoppingListElements, product];
    } else {
      updatedShoppingList = [product];
    }

    this._putShoppingList(updatedShoppingList).subscribe({
      next: () => {
        this.shoppingListElements = updatedShoppingList;
        this.productsChanged.next('');
      },
      error: (error) => {
        this.toastr.error('Error: New Product could not be saved in Your Shopping List.');
        this.shoppingListLoading.next(false);
      },
    });
  }

  deleteProduct(index: number): void {
    const shoppingList = this.shoppingListElements!.filter((element, i) =>{ if(i === index){
      this.deletedProductsStack.push(element);
        if(this.deletedProductsStack.length === 1) {
          this.deletedProducts.next(1);
        }
      }
      return i !==index
    });

    this._putShoppingList(shoppingList).subscribe({
      next: () => {
        this.shoppingListElements = shoppingList;
        this.productsChanged.next('');
      },
      error: (error) => {
        this.toastr.error('Error: Product could not be removed from Your Shopping List.');
        this.productsChanged.next('');
      },
    });
  }

  updateProduct(index: number, product: ShoppingListElement): void {
    const shoppingList = this.shoppingListElements!.map((prod, i)=> {
      if (i === index) return product;
      return prod;
    });
    this._putShoppingList(shoppingList).subscribe({
      next: () => {
        this.shoppingListElements = shoppingList;
        this.productsChanged.next('');
      },
      error: (error) => {
        this.toastr.error('Error: Product could not be updated.');
      },
    });
  }

  clear() :void {
    const shoppingList: ShoppingListElement[] = [];

    this._putShoppingList(shoppingList).subscribe({
      next: () => {
        this.shoppingListElements = shoppingList;
        this.productsChanged.next('');
      },
      error: (error) => {
        this.toastr.error('Error: Shopping List could not be updated.');
      },
    });
  }

  reviveLastProduct(): void {
    const deletedProduct = this._getLastDeletedProduct()
    if(this.deletedProductsStack.length === 0) this.deletedProducts.next(-1);
    if(!deletedProduct) return;

    this.addProduct(deletedProduct);
  }

  addBoughtElementsToPantry(): void {
    const products = this.shoppingListElements!.filter(product => product.bought);
    this.pantryService.addElements(products);
  }

  private _getLastDeletedProduct(): ShoppingListElement | undefined {
    return this.deletedProductsStack.pop()
  }
}
