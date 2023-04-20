import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Product } from '../shopping-list/shopping-list-element/shopping-list-element.model';
import { PantryService } from './pantry.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.scss']
})
export class PantryComponent implements OnInit, OnDestroy{
  pantry: Product[] | undefined;

  pantryChangesSub: Subscription | undefined;
  pantryElementEditSub: Subscription | undefined;

  loading: boolean = true;
  elementEditing: boolean = false;
  elementIndex: number | undefined;
  form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    qty: new FormControl<number | null | undefined>(null),
    unit: new FormControl<string | null | undefined>(null),
    date: new FormControl<Date | string | null | undefined>(null),
  })

  constructor(private pantryService: PantryService) {}

  ngOnInit(): void {
    this.pantryChangesSub = this.pantryService.pantryChanged.subscribe(()=>{
      this.pantry = this.pantryService.getPantry();
      this.loading = false;
      this.elementEditing = false;
      this.form.reset();
    });

    this.pantryElementEditSub = this.pantryService.pantryElementEdit.subscribe((id) => {
      this.elementEditing = true;
      this.elementIndex = id;
      const product = this.pantry![id];
      this.form.controls.name.setValue(product.name!);
      this.form.controls.qty.setValue(product.quantity);
      this.form.controls.unit.setValue(product.unit);
      if (product.expDate) {
        this.form.controls.date.setValue(formatDate(product.expDate, 'yyyy-MM-dd', 'en'));
      }
    })

    if(!this.pantryService.pantryFetched) {
      this.pantryService.fetchPantry();
    } else {
      this.pantry = this.pantryService.getPantry();
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.pantryChangesSub?.unsubscribe();
  }

  onAddClick(): void {
    const newProduct = this._getFormElement();
    this.pantryService.addElement(newProduct);
    this.form.reset();
  }

  onSaveClick(): void {
    const updatedProduct = this._getFormElement();
    this.pantryService.updateElement(updatedProduct, this.elementIndex!);
    this.form.reset();
    this.elementEditing = false;
  }

  _getFormElement(): Product {
    const name = this.form.controls.name.value!;
    const qty = this.form.controls.qty.value;
    const unit = this.form.controls.unit.value;
    const expDate = this.form.controls.date.value;

    const newProduct = new Product(name, qty, unit, expDate);

    return newProduct;
  }

  onClickOutsideElementMenu(event: MouseEvent) {
    this.pantryService.clickOutsideMoreMenu.next(event);
  }
}

