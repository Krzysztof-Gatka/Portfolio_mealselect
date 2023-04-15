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

  loading: boolean = true;
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    qty: new FormControl(null),
    unit: new FormControl(''),
    date: new FormControl(null),
  })

  constructor(private pantryService: PantryService) {}

  ngOnInit(): void {
    this.pantryChangesSub = this.pantryService.pantryChanged.subscribe(()=>{
      this.pantry = this.pantryService.getPantry();
      this.loading = false;
    });

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
}

