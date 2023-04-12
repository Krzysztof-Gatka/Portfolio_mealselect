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
  pantry: Product[] = [];
  pantryChangesSub: Subscription | undefined;
  pantryFetchedSub: Subscription | undefined;
  loading: boolean = true;
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    qty: new FormControl(null),
    unit: new FormControl(''),
    date: new FormControl(null),
  })

  constructor(private pantryServcie: PantryService) {}

  ngOnInit(): void {
    this.pantryServcie.fetchPantry();
    this.pantryFetchedSub = this.pantryServcie.pantryFetched.subscribe(()=> {
      this.pantry = this.pantryServcie.getPantry();
      this.loading = false;
    })
    this.pantryChangesSub = this.pantryServcie.pantryChanged.subscribe(()=>{
      this.pantry = this.pantryServcie.getPantry();
    })
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

    this.pantryServcie.addElement(newProduct);
    this.form.reset();
  }
}

