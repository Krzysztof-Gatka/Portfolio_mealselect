import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Product } from 'src/app/shopping-list/shopping-list-element/product.model';

@Component({
  selector: 'app-pantry-element',
  templateUrl: './pantry-element.component.html',
  styleUrls: ['./pantry-element.component.scss']
})
export class PantryElementComponent {
  @Input() product!: Product;
  @Input() index!: number;
  @Output() prodcutSaved = new EventEmitter<{product: Product, index: number}>();
  editMode: boolean = false;
  form = new FormGroup({
    name: new FormControl(''),
    qty: new FormControl(0),
    unit: new FormControl(''),
    date: new FormControl(new Date()),
  })

  onEditClick(): void {
    this.form.controls.name.setValue(this.product.name);
    this.form.controls.qty.setValue(this.product.quantity);
    this.form.controls.unit.setValue(this.product.unit);
    // this.form.controls.date.setValue((this.product.expDate) ? this.product.expDate : null);
    this.editMode = true;
  }

  onSaveClick(): void {
    this.product.name = this.form.controls.name.value!;
    this.product.quantity = this.form.controls.qty.value!;
    this.product.unit = this.form.controls.unit.value!;
    // this.product.name = this.form.controls.name.value!;

    this.prodcutSaved.emit({product: this.product, index: this.index});
    this.editMode = false;
  }
}
