import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Product } from './product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list-element',
  templateUrl: './shopping-list-element.component.html',
  styleUrls: ['./shopping-list-element.component.scss']
})
export class ShoppingListElementComponent implements OnInit, OnDestroy {
  @Input() product: Product | undefined;
  @Input() productIndex: number | undefined;
  isActive: boolean = true;
  editMode: boolean = false;
  editButtonDisabled: boolean = false;
  sub: Subscription | undefined;
  sub2: Subscription | undefined;
  form = new FormGroup({
    productName: new FormControl('', Validators.required),
    productQuantity: new FormControl('', Validators.required),
    productUnit: new FormControl('', Validators.required)
  })

  constructor(private shoppingListService: ShoppingListService, private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    this.sub = this.shoppingListService.productBeingEdited.subscribe((id)=>{
      this.editButtonDisabled = id !== this.productIndex;
    })

    this.sub2 = this.shoppingListService.productSaved.subscribe(() => {
      this.editButtonDisabled = false;
    })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }


  onProductClick(): void {
    this.isActive = !this.isActive;
  }

  onButtonClick(): void {
    this.shoppingListService.deleteElement(this.productIndex!);
  }

  onEditButtonClick(): void {
    this.editMode = true;
    this.shoppingListService.productBeingEdited.next(this.productIndex!);
  }

  onSaveButtonClick(): void {
    this.editMode = false;
    this.shoppingListService.productSaved.next(this.productIndex!);
  }

  onSavebuttonClikced(product: Product): void {
    this.product = product;
    this.shoppingListService.updateElement(this.productIndex!, this.product);
  }
}
