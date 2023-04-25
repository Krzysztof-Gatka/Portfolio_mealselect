import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, catchError, of, retry } from "rxjs";

import { AuthService } from "../auth/auth.service";
import { Default_URL } from "../recipes/recipes.service";
import { PantryElement } from "./pantry-element/pantry.model";
import { ToastrService } from "ngx-toastr";

@Injectable({providedIn: 'root'})
export class PantryService {
  private pantry: PantryElement[] | undefined;

  pantryFetched: boolean = false;
  error: boolean = false;
  pantryChanged = new Subject();
  pantryElementEdit = new Subject<number>();
  clickOutsideMoreMenu = new Subject<MouseEvent>();

  constructor(
    private authService:AuthService,
    private http: HttpClient,
    private toastr: ToastrService,
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

  private _putPantry(): void {
    const user = this.authService.user!;
    const params = new HttpParams().set('auth', this.authService.user!.token);

    this.http.put(Default_URL + user.uid + '/pantry.json', this.pantry ,{params: params})
      .pipe(
        retry({count: 3, delay: 2000}),
        catchError((error) => {
          console.warn(error);
          this.toastr.error('Error: Saving Pantry on Server failed.');
          this.error = true;
          return of(-1);
        })
      )
      .subscribe();
  }

  getPantry(): PantryElement[] {
    if(this.pantry) {
      return this.pantry.slice();
    } else {
      return [];
    }
  }

  deleteElement(index: number): void {
    this.pantry = this.pantry!.filter((product, i) => i !== index);
    this._putPantry();
    this.pantryChanged.next('');
  }

  updateElement(product: PantryElement, index: number): void {
    this.pantry = this.pantry!.map((prod, i) => (i === index) ? product : prod);
    this._putPantry();
    this.pantryChanged.next('');
  }

  addElement(product: PantryElement): void {
    if(this.pantry) {
      this.pantry.push(product);
    } else {
      this.pantry = [product];
    }
    this._putPantry();
    this.pantryChanged.next('');
  }

  clearPantry(): void {
    this.pantry = [];
    this.pantryChanged.next('');
    this._putPantry();
  }
}
