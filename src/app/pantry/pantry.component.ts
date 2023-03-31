import { Component, OnInit } from '@angular/core';
import { Product } from '../shopping-list/shopping-list-element/product.model';
import { PantryService } from './pantry.service';

@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.scss']
})
export class PantryComponent implements OnInit{
  pantry: Product[] = [];

  constructor(private pantryServcie: PantryService) {}

  ngOnInit(): void {
    this.pantry = this.pantryServcie.getPantry();
  }

  onProductSaved(event: {product: Product, index: number}): void {
    this.pantry = this.pantry.map((prod, i) => {
      if(i === event.index) {
        return event.product;
      } else {
        return prod;
      }
    })
  }
}

