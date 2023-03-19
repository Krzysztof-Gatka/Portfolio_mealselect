import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Product } from '../shopping-list-element/product.model';

@Component({
  selector: 'app-shopping-list-input',
  templateUrl: './shopping-list-input.component.html',
  styleUrls: ['./shopping-list-input.component.scss']
})
export class ShoppingListInputComponent implements OnInit {

  form = new FormGroup({
    productName: new FormControl('', Validators.required),
    productQuantity: new FormControl('', Validators.pattern(/^[1-9][0-9]*/)),
    productUnit: new FormControl('',)
  })

  @Output() itemAdded = new EventEmitter<Product>();
  @Input() editing: boolean | undefined;
  @Input() product: Product | undefined;

  ngOnInit(): void {
    if(this.product) {
      this.form = new FormGroup({
        productName: new FormControl(this.product.name, Validators.required),
        productQuantity: new FormControl(this.product.quantity.toString(), Validators.pattern(/^[1-9][0-9]*/)),
        productUnit: new FormControl(this.product.unit,)
      })
    }
  }

  onAddButtonClick(): void {
    const name = this.form.controls.productName.value!;
    const quantity = +this.form.controls.productQuantity.value!;
    const unit = this.form.controls.productUnit.value!;
    const newProduct = new Product(name, quantity, unit);
    this.itemAdded.emit(newProduct);
    this.form.reset();
  }

  onClearButtonClick(): void {
    this.form.reset();
  }
}
