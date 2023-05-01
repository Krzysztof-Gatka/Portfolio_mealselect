import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, of, retry } from "rxjs";

import { AuthService } from "../auth/auth.service";
import { Default_URL } from "../recipes/recipes.service";
import { PantryElement } from "./pantry-element/pantry.model";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PantryService {
  private pantry: PantryElement[] | undefined;

  pantryFetched: boolean = false;
  error: boolean = false;

  pantryChanged = new Subject();
  pantryLoading = new Subject<boolean>();
  pantryElementEdit = new Subject<number>();
  clickOutsideMoreMenu = new Subject<MouseEvent>();

  constructor(
    private authService:AuthService,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
  ) {}


  fetchPantry(): void {
    const user = this.authService.user!;
    const params = new HttpParams().set('auth', this.authService.user!.token);

    this.http.get<PantryElement[]>(Default_URL + user.uid + '/pantry.json', { params: params})
      .pipe(
        retry({count: 3, delay:2000}),
        catchError((error) => {
          console.warn(error);
          this.toastr.error('Error: Downloading of Pantry from server failed.');
          this.error = true;
          return of([]);
        }),
      )
      .subscribe((products)=> {
        this.pantry = products;
        if(!this.error) this.pantryFetched = true;
        this.pantryChanged.next('');
      })
  }

  private _putPantry(): Observable<PantryElement> {
    const user = this.authService.user!;
    const params = new HttpParams().set('auth', this.authService.user!.token);

    return this.http.put<PantryElement>(Default_URL + user.uid + '/pantry.json', this.pantry ,{params: params})
      .pipe(
        retry({count: 3, delay: 2000}),
        catchError((error) => {
          console.warn(error);
          this.toastr.error('Error: Saving Pantry on Server failed.');
          this.error = true;
          throw new Error(error);
        })
      )
  }

  getPantry(): PantryElement[] {
    if(!this.pantry) return [];
    return this.pantry.slice();
  }

  deleteElement(index: number): void {
    const updatedPantry = this.pantry!.filter((product, i) => i !== index);
    this._putPantry().subscribe({
      next: () => {
        // this.toastr.success('test');
        this.pantry = updatedPantry.slice();
        this.pantryLoading.next(false);
        this.pantryChanged.next('');
      },
      error: (error) => {
        this.toastr.error('Error: Product could not be removed.');
        console.warn(error);
        this.pantryLoading.next(false);

      },
    });
  }

  updateElement(product: PantryElement, index: number): void {
    const updatedPantry = this.pantry!.map((prod, i) => (i === index) ? product : prod);
    this._putPantry().subscribe({
      next: () => {
        // this.toastr.success('test');
        this.pantry = updatedPantry.slice();
        this.pantryLoading.next(false);
        this.pantryChanged.next('');

      },
      error: (error) => {
        this.toastr.error('Error: Product could not be updated.');
        console.warn(error);
        this.pantryLoading.next(false);
      },
    });
  }

  addElement(product: PantryElement): void {
    let updatedPantry: PantryElement[] = [];

    if(this.pantry) {
      updatedPantry = [...this.pantry, product];
    } else {
      updatedPantry = [product];
    }

    this._putPantry().subscribe({
      next: () => {
        // this.toastr.success('test');
        this.pantry = updatedPantry.slice();
        this.pantryLoading.next(false);
        this.pantryChanged.next('');
      },
      error: (error) => {
        this.toastr.error('Error: Product could not be updated.');
        console.warn(error);
        this.pantryLoading.next(false);
      },
    });
  }

  addElementsToPantry(products: PantryElement[]) {
    let updatedPantry: PantryElement[] = []

    if (this.pantry) {
      const updatedPantry = this.pantry!;
      products.map((product) => {
        updatedPantry.push(product);
      });
    } else {
      updatedPantry = [...products];
    }

    this._putPantry().subscribe({
      next: () => {
        // this.toastr.success('test');
        this.pantry = updatedPantry.slice();
        this.pantryLoading.next(false);
        this.pantryChanged.next('');
      },
      error: (error) => {
        this.toastr.error('Error: Products could not be added to Pantry.');
        console.warn(error);
        this.pantryLoading.next(false);
      },
    });
  }

  clearPantry(): void {
    const updatedPantry: PantryElement[] = [];

    this._putPantry().subscribe({
      next: () => {
        // this.toastr.success('test');
        this.pantry = updatedPantry.slice();
        this.pantryLoading.next(false);
        this.pantryChanged.next('');
      },
      error: (error) => {
        this.toastr.error('Error: Could not connect to DataBase.');
        console.warn(error);
        this.pantryLoading.next(false);
      },
    });
  }
}
