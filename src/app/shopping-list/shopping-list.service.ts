import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, of, retry } from 'rxjs'

import { AuthService } from "../auth/auth.service";
import { PantryService } from "../pantry/pantry.service";
import { Default_URL } from "../recipes/recipes.service";
import { ToastrService } from "ngx-toastr";
import { ShoppingListElement } from "./shopping-list-element/shopping-list-element.model";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class ShoppingListService {
  private shoppingListElements: ShoppingListElement[] | undefined;

  productsFetched: boolean = false;
  error: boolean = false;

  productsChanged = new Subject();

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
        console.warn(error);
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
        console.warn(error);
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
        console.warn(error);
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
        console.warn(error);
        this.shoppingListLoading.next(false);
      },
    });
  }

  deleteProduct(index: number): void {
    const shoppingList = this.shoppingListElements!.filter((_, i) => i !==index);

    this._putShoppingList(shoppingList).subscribe({
      next: () => {
        this.shoppingListElements = shoppingList;
        this.productsChanged.next('');
      },
      error: (error) => {
        this.toastr.error('Error: Product could not be removed from Your Shopping List.');
        console.warn(error);
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
        console.warn(error);
      },
    });
  }

  clearList() :void {
    const shoppingList: ShoppingListElement[] = [];

    this._putShoppingList(shoppingList).subscribe({
      next: () => {
        this.shoppingListElements = shoppingList;
        this.productsChanged.next('');
      },
      error: (error) => {
        console.warn(error);
        this.toastr.error('Error: Shopping List could not be updated.');
      },
    });
  }

  addBoughtElementsToPantry(): void {
    this.router.navigate(['/pantry']);
    const boughtProducts = this.shoppingListElements!.filter(product => product.bought);
    const products = this.shoppingListElements!.filter(product => !product.bought);
    this._putShoppingList(products).subscribe({
      next: () => {
        this.shoppingListElements = products.slice();
        this.productsChanged.next('');
      },
      error: (error) => {
        // no toast because this error will be displayed by pantry comp
        console.warn(error);
      }
    })

    // Timout for allowing pantry component to fully init and listen to pantryLoading Subject
    setTimeout(()=> {
      this.pantryService.pantryLoading.next(true);
      this.pantryService.addElements(boughtProducts);
    },0)
  }
}
