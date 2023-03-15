import { Component, Input } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';

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

  constructor(private shoppingListService: ShoppingListService) {}

  onButtonClick(): void {
    this.shoppingListService.deleteElement(this.productIndex!);
  }

  onProductClick(): void {
    this.isActive = !this.isActive;
  }
}
