import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ShoppingListService } from '../shopping-list.service';
import { Subscription } from 'rxjs';
import { ShoppingListElement } from '../shopping-list-element/shopping-list-element.model';

@Component({
  selector: 'app-shopping-list-input',
  templateUrl: './shopping-list-input.component.html',
  styleUrls: ['./shopping-list-input.component.scss']
})
export class ShoppingListInputComponent implements OnInit, OnDestroy {

  form = new FormGroup({
    productName: new FormControl('', Validators.required),
    productQuantity: new FormControl<number | null | undefined>(null, Validators.pattern(/^[1-9][0-9]*/)),
    productUnit: new FormControl<string | null | undefined>(null)
  })

  @Output() itemAdded = new EventEmitter<ShoppingListElement>();
  @Output() saveButtonClicked = new EventEmitter<ShoppingListElement>();
  @Input() editing: boolean | undefined;
  @Input() product: ShoppingListElement | undefined;
  sub: Subscription | undefined;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    if(this.product) {
      this.form = new FormGroup({
        productName: new FormControl(this.product.name, Validators.required),
        productQuantity: new FormControl(this.product.quantity, Validators.pattern(/^[1-9][0-9]*/)),
        productUnit: new FormControl<string | null | undefined>(this.product.unit)
      })
    }
    this.sub = this.shoppingListService.productSaved.subscribe(()=> {
      this.saveButtonClicked.emit(this._createProduct());
    })
  }

  ngOnDestroy(): void {
      this.sub?.unsubscribe();
  }
  onClearButtonClick(): void {
    this.form.reset();
  }

  onAddButtonClick(): void {
    this.itemAdded.emit(this._createProduct());
    this.form.reset();
  }


  private _createProduct(): ShoppingListElement {
    const name = this.form.controls.productName.value!;
    const quantity = +this.form.controls.productQuantity.value!;
    const unit = this.form.controls.productUnit.value!;
    return new ShoppingListElement(name, quantity, unit);
  }
}
