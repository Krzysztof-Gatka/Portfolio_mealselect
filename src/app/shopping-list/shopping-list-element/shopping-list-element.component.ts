import { Component, Input } from '@angular/core';

import { Product } from './product.model';

@Component({
  selector: 'app-shopping-list-element',
  templateUrl: './shopping-list-element.component.html',
  styleUrls: ['./shopping-list-element.component.scss']
})
export class ShoppingListElementComponent {
  @Input() product: Product | undefined;
  isActive: boolean = true;

  onButtonClick():void {
    this.isActive = !this.isActive;
  }
}
