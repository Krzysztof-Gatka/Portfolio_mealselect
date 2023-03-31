import { Component, Input } from '@angular/core';
import { Product } from 'src/app/shopping-list/shopping-list-element/product.model';

@Component({
  selector: 'app-pantry-element',
  templateUrl: './pantry-element.component.html',
  styleUrls: ['./pantry-element.component.scss']
})
export class PantryElementComponent {
  @Input() product!: Product;
  editMode: boolean = false;

  onEditClick(): void {
    this.editMode = true;
  }

  onSaveClick(): void {
    this.editMode = false;
  }
}
