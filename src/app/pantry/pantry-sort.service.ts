import { Injectable } from "@angular/core";
import { PantryElement } from "./pantry-element/pantry.model";

@Injectable({providedIn: 'root'})
export class PantrySortService {

  sortByExpirationDate(pantry :PantryElement[]): PantryElement[] {
    const noDatePantry = pantry.filter(pantryElement => !pantryElement.expDate);
    let datePantry = pantry.filter(pantryElement => !!pantryElement.expDate);
    datePantry = datePantry.sort((a, b) => new Date(a.expDate!).getTime() - new Date(b.expDate!).getTime());
    return [...datePantry, ...noDatePantry];
  }
}
