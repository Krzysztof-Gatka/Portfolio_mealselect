import { Injectable } from "@angular/core";
import { PantryService } from "./pantry.service";
import { PantryElement } from "./pantry-element/pantry.model";

@Injectable({providedIn: 'root'})
export class PantrySortService {

  constructor(private pantryService: PantryService) {}

  sortByExpirationDate(): PantryElement[] {
    const pantry = this.pantryService.getPantry();
    const noDatePantry = pantry.filter(pantryElement => !pantryElement.expDate);
    let datePantry = pantry.filter(pantryElement => !!pantryElement.expDate);
    datePantry = datePantry.sort((a, b) => new Date(a.expDate!).getTime() - new Date(b.expDate!).getTime());
    return [...datePantry, ...noDatePantry];
  }
}
