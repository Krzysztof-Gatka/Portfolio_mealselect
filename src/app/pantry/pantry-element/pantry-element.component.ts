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
  editMode: boolean = false;
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    qty: new FormControl(0),
    unit: new FormControl(''),
    date: new FormControl(new Date()),
  })

  constructor(private pantryService: PantryService) {}

  onDeleteClick(): void {
    this.pantryService.deleteElement(this.index);
  }

  onEditClick(): void {
    this.form.controls.name.setValue(this.product.name);
    this.form.controls.qty.setValue(this.product.quantity);
    this.form.controls.unit.setValue(this.product.unit);
    this.form.controls.date.setValue((this.product.expDate) ? this.product.expDate : null);
    this.editMode = true;
  }

  onSaveClick(): void {
    this.product.name = this.form.controls.name.value!;
    this.product.quantity = this.form.controls.qty.value!;
    this.product.unit = this.form.controls.unit.value!;
    this.product.expDate = this.form.controls.date.value!;

    this.pantryService.updateElement(this.product, this.index);
    this.editMode = false;
  }
}
