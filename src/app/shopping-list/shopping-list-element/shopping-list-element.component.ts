import { Component, Input } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Product } from './product.model';

@Component({
  selector: 'app-shopping-list-element',
  templateUrl: './shopping-list-element.component.html',
  styleUrls: ['./shopping-list-element.component.scss']
})
export class ShoppingListElementComponent {
  @Input() product: Product | undefined;
  @Input() productIndex: number | undefined;
  isActive: boolean = true;
  editMode: boolean = false;
  form = new FormGroup({
    productName: new FormControl('', Validators.required),
    productQuantity: new FormControl('', Validators.required),
    productUnit: new FormControl('', Validators.required)
  })

  constructor(private shoppingListService: ShoppingListService) {}

  onProductClick(): void {
    this.isActive = !this.isActive;
  }

  onButtonClick(): void {
    this.shoppingListService.deleteElement(this.productIndex!);
  }

  onEditButtonClick(): void {
    this.editMode = true;
    this.form.controls.productName.setValue(this.product!.name);
    this.form.controls.productQuantity.setValue(this.product!.quantity.toString());
    this.form.controls.productUnit.setValue(this.product!.unit);
  }

  onSaveButtonClick(): void {
    this.editMode = false;

    const name = this.form.controls.productName.value!;
    const quantity = +this.form.controls.productQuantity.value!;
    const unit = this.form.controls.productUnit.value!;

    const newProduct = new Product(name, quantity, unit);

    this.shoppingListService.updateElement(this.productIndex!, newProduct);
  }
}
