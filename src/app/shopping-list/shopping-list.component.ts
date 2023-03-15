import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ShoppingListService } from './shopping-list.service';
import { Product } from './shopping-list-element/product.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  shoppingListElements: Product[] | undefined;
  form = new FormGroup({
    productName: new FormControl('', Validators.required),
    productQuantity: new FormControl('', Validators.required),
    productUnit: new FormControl('', Validators.required)
  })

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.shoppingListElements = this.shoppingListService.getShoppingListElements();
    this.shoppingListService.productDeleted.subscribe(()=> {
      this.shoppingListElements = this.shoppingListService.getShoppingListElements();
    })
  }

  onAddButtonClick(): void {
    // Button is disabled when inputs are empty
    // so i am sure that in these variables will be valid value
    const name = this.form.controls.productName.value!;
    const quantity = +this.form.controls.productQuantity.value!;
    const unit = this.form.controls.productUnit.value!;

    const newProduct = new Product(name, quantity, unit);

    this.shoppingListElements = this.shoppingListService.addElement(newProduct);
    this.form.reset();
  }

  isFormValid(): boolean {
    return !this.form.valid && this.form.touched
  }
}
