import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { AuthService } from "../auth/auth.service";
import { Product } from "../shopping-list/shopping-list-element/product.model";
import { Default_URL } from "../recipes/recipes.service";

@Injectable({providedIn: 'root'})
export class PantryService {
  private pantry: Product[] = [];

  pantryChanged = new Subject();

  constructor(
    private authService:AuthService,
    private http: HttpClient,
  ) {}


  fetchPantry(): void {
    const user = this.authService.user!;
    const params = new HttpParams().set('auth', this.authService.user!.token);

    this.http.get<Product[]>(Default_URL + user.uid + '/pantry.json', { params: params})
      .subscribe((products)=> {
        this.pantry = products;
        this.pantryChanged.next('');
      })
  }

  private _putPantry(): void {
    const user = this.authService.user!;
    const params = new HttpParams().set('auth', this.authService.user!.token);

    this.http.put(Default_URL + user.uid + '/pantry.json', this.pantry ,{params: params}).subscribe();
  }

  getPantry(): Product[] {
    if(this.pantry) {
      return this.pantry.slice();
    } else {
      return [];
    }
  }

  deleteElement(index: number): void {
    this.pantry = this.pantry.filter((product, i) => i !== index);
    this._putPantry();
    this.pantryChanged.next('');
  }

  updateElement(product: Product, index: number): void {
    this.pantry = this.pantry.map((prod, i) => (i === index) ? product : prod);
    this._putPantry();
    this.pantryChanged.next('');
  }

  addElement(product: Product): void {
    if(this.pantry) {
      this.pantry.push(product);
    } else {
      this.pantry = [product];
    }
    this._putPantry();
    this.pantryChanged.next('');
  }
}
