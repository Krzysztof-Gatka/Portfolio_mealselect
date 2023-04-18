import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Product } from '../shopping-list/shopping-list-element/product.model';
import { PantryService } from './pantry.service';

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
    qty: new FormControl<number | null>(null),
    unit: new FormControl<string | null>(null),
    date: new FormControl<Date | null>(null),
  })

  constructor(private pantryService: PantryService) {}

  ngOnInit(): void {
    this.pantryChangesSub = this.pantryService.pantryChanged.subscribe(()=>{
      this.pantry = this.pantryService.getPantry();
      this.loading = false;
    });

    this.pantryElementEditSub = this.pantryService.pantryElementEdit.subscribe((id) => {
      this.elementEditing = true;
      this.elementIndex = id;
      const product = this.pantry![id];
      this.form.controls.name.setValue(product.name);
      if(product.quantity) {
        this.form.controls.qty.setValue(product.quantity);
      }
      if(product.unit) {
        this.form.controls.unit.setValue(product.unit);
      }
      if(product.expDate) {
        this.form.controls.date.setValue(product.expDate);
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
    const name = this.form.controls.name.value!;
    const qty = this.form.controls.qty.value!;
    const unit = this.form.controls.unit.value!;
    let newProduct: Product;

    if (this.form.controls.date.value!) {
      const expDate = new Date(this.form.controls.date.value!);
      newProduct = new Product(name, qty, unit, expDate);
    } else {
      newProduct = new Product(name, qty, unit);
    }

    this.pantryService.addElement(newProduct);
    this.form.reset();
  }

  onSaveClick(): void {
    const name = this.form.controls.name.value!;
    const qty = this.form.controls.qty.value!;
    const unit = this.form.controls.unit.value!;
    let newProduct: Product;

    if (this.form.controls.date.value!) {
      const expDate = new Date(this.form.controls.date.value!);
      newProduct = new Product(name, qty, unit, expDate);
    } else {
      newProduct = new Product(name, qty, unit);
    }

    this.pantryService.updateElement(newProduct, this.elementIndex!);
    this.form.reset();
    this.elementEditing = false;
  }

  _getFormElement(): Product {
    const name = this.form.controls.name.value!;
    const qty = this.form.controls.qty.value;
    const unit = this.form.controls.unit.value;
    let newProduct: Product;

    if (this.form.controls.date.value!) {
      const expDate = new Date(this.form.controls.date.value!);
      newProduct = new Product(name, qty, unit, expDate);
    } else {
      newProduct = new Product(name, qty, unit);
    }

    return newProduct;
  }
}

