import { Component } from '@angular/core';
import { Product } from '../shopping-list/shopping-list-element/product.model';

@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.scss']
})
export class PantryComponent {
  pantry: Product[] = [];
}
