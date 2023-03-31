import { Injectable } from "@angular/core";
import { Product } from "../shopping-list/shopping-list-element/product.model";

@Injectable({providedIn: 'root'})
export class PantryService {
  pantry: Product[] = [
    new Product('pasta', 500, 'g', new Date()),
    new Product('meat', 400, 'g', new Date()),
    new Product('cheese', 300, 'g', new Date()),
    new Product('butter', 100, 'g', new Date()),
  ];


  fetchPantry(): void {
  }

  getPantry(): Product[] {
    return this.pantry.slice();
  }
}
