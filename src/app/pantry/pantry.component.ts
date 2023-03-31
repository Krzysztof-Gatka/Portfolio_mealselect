import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  form = new FormGroup({
    name: new FormControl(''),
    qty: new FormControl(0),
    unit: new FormControl(''),
    date: new FormControl(new Date()),
  })

  constructor(private pantryServcie: PantryService) {}

  ngOnInit(): void {
    this.pantryChangesSub = this.pantryServcie.pantryChanged.subscribe(()=>{
      this.pantry = this.pantryServcie.getPantry();
    })

    this.pantry = this.pantryServcie.getPantry();
  }

  ngOnDestroy(): void {
    this.pantryChangesSub?.unsubscribe();
  }

  onAddClick(): void {
    const name = this.form.controls.name.value!;
    const qty = this.form.controls.qty.value!;
    const unit = this.form.controls.unit.value!;
    const newProduct = new Product(name, qty, unit);

    this.pantryServcie.addElement(newProduct);
  }
}

