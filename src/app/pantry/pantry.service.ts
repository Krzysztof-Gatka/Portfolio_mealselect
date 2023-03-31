import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Product } from "../shopping-list/shopping-list-element/product.model";

@Injectable({providedIn: 'root'})
export class PantryService {
  pantryChanged = new Subject();
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

  deleteElement(index: number): void {
    this.pantry = this.pantry.filter((product, i) => i !== index);
    this.pantryChanged.next('');
  }

  updateElement(product: Product, index: number): void {
    this.pantry = this.pantry.map((prod, i) => (i === index) ? product : prod);
    this.pantryChanged.next('');
  }

  addElement(product: Product): void {
    this.pantry.push(product);
    this.pantryChanged.next('');
  }
}
