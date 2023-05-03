import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, of, retry } from "rxjs";

import { ToastrService } from "ngx-toastr";
import { AuthService } from "../auth/auth.service";
import { PantrySortService } from "./pantry-sort.service";
import { PantryElement } from "./pantry-element/pantry.model";
import { Default_URL } from "../recipes/recipes.service";

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
    private http: HttpClient,
    private toastr: ToastrService,
    private authService:AuthService,
    private pantrySortService: PantrySortService,
  ) {}

  fetchPantry(): void {
    const user = this.authService.user!;
    const params = new HttpParams().set('auth', this.authService.user!.token);

    this.http.get<PantryElement[]>(Default_URL + user.uid + '/pantry.json', { params: params })
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

  private _putPantry(updatedPantry: PantryElement[]): Observable<PantryElement> {
    const user = this.authService.user!;
    const params = new HttpParams().set('auth', this.authService.user!.token);

    return this.http.put<PantryElement>(Default_URL + user.uid + '/pantry.json', updatedPantry ,{params: params})
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

  addElement(product: PantryElement): void {
    let updatedPantry: PantryElement[] = [];

    if(this.pantry) {
      updatedPantry = [...this.pantry, product];
    } else {
      updatedPantry = [product];
    }

    this._putPantry(updatedPantry).subscribe({
      next: () => {
        this.pantry = updatedPantry.slice();
        this.pantryChanged.next('');
      },
      error: (error) => {
        console.warn(error);
        this.toastr.error('Error: Product could not be added.');
        this.pantryLoading.next(false);
      },
    });
  }

  updateElement(product: PantryElement, index: number): void {
    const updatedPantry = this.pantry!.map((prod, i) => (i === index) ? product : prod);
    this._putPantry(updatedPantry).subscribe({
      next: () => {
        this.pantry = updatedPantry.slice();
        this.pantryChanged.next('');
      },
      error: (error) => {
        console.warn(error);
        this.toastr.error('Error: Product could not be updated.');
        this.pantryLoading.next(false);
      },
    });
  }

  deleteElement(index: number): void {
    const updatedPantry = this.pantry!.filter((_, i) => i !== index);
    this._putPantry(updatedPantry).subscribe({
      next: () => {
        this.pantry = updatedPantry.slice();
        this.pantryChanged.next('');
      },
      error: (error) => {
        console.warn(error);
        this.toastr.error('Error: Product could not be removed.');
        this.pantryLoading.next(false);
      },
    });
  }

  addElements(products: PantryElement[]) {
    let updatedPantry: PantryElement[];

    if (this.pantry) {
      updatedPantry = [...this.pantry, ...products];
    } else {
      updatedPantry = [...products];
    }

    this._putPantry(updatedPantry).subscribe({
      next: () => {
        this.pantry = updatedPantry.slice();
        this.pantryChanged.next('');
      },
      error: (error) => {
        console.warn(error);
        this.toastr.error('Error: Products could not be added to Pantry.');
        this.pantryLoading.next(false);
      },
    });
  }

  clearPantry(): void {
    const updatedPantry: PantryElement[] = [];

    this._putPantry(updatedPantry).subscribe({
      next: () => {
        this.pantry = updatedPantry;
        this.pantryChanged.next('');
      },
      error: (error) => {
        console.warn(error);
        this.toastr.error('Error: Could not connect to DataBase.');
        this.pantryLoading.next(false);
      },
    });
  }

  sortPantry(): void {
    const sortedPantry = this.pantrySortService.sortByExpirationDate(this.getPantry());

    this._putPantry(sortedPantry).subscribe({
      next: () => {
        this.pantry = sortedPantry.slice();
        this.pantryChanged.next('');
      },
      error: (error) => {
        console.warn(error);
        this.toastr.error('Error: Products could not be sorted.');
        this.pantryLoading.next(false);
      },
    });
  }
}
