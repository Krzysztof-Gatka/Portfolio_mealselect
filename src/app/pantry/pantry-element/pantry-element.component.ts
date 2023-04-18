import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/shopping-list/shopping-list-element/product.model';
import { PantryService } from '../pantry.service';

@Component({
  selector: 'app-pantry-element',
  templateUrl: './pantry-element.component.html',
  styleUrls: ['./pantry-element.component.scss']
})
export class PantryElementComponent {
  @Input() product!: Product;
  @Input() index!: number;

  expandPantryEl: boolean = false;

  constructor(private pantryService: PantryService) {}

  onDeleteClick(): void {
    this.pantryService.deleteElement(this.index);
  }

  onEditClick(): void {
    this.pantryService.pantryElementEdit.next(this.index);
  }
}
