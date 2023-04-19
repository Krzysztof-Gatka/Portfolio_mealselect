import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ShoppingListService } from '../shopping-list.service';
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
  @ViewChild('btnMore') btnMore: ElementRef<HTMLButtonElement> | undefined;

  editButtonDisabled: boolean = false;
  openMoreMenu: boolean = false;

  editSub: Subscription | undefined;
  saveSub: Subscription | undefined;
  clickOutsideSub: Subscription | undefined;

  form = new FormGroup({
    productName: new FormControl('', Validators.required),
    productQuantity: new FormControl('', Validators.required),
    productUnit: new FormControl('', Validators.required)
  })

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.clickOutsideSub = this.shoppingListService.clickOutsideMoreMenu.subscribe((event) => {
      if(!this.btnMore?.nativeElement.contains(<Node>event.target!)) {
        this.openMoreMenu = false;
      }
    })
    this.editSub = this.shoppingListService.productBeingEdited.subscribe((id)=>{
      if(id === -1) {
        this.editButtonDisabled = false;
      } else {
        this.editButtonDisabled = id !== this.productIndex;
      }
    })

    this.saveSub = this.shoppingListService.productSaved.subscribe(() => {
      this.editButtonDisabled = false;
    })
  }

  ngOnDestroy(): void {
    this.editSub?.unsubscribe();
    this.saveSub?.unsubscribe();
    this.clickOutsideSub?.unsubscribe();
  }

  onProductClick(): void {
    this.shoppingListService.toggleBought(this.productIndex!);
  }





  onSaveButtonClick(): void {
    this.shoppingListService.productSaved.next(this.productIndex!);
  }

  onSavebuttonClikced(product: Product): void {
    this.product = product;
    this.shoppingListService.updateProduct(this.productIndex!, this.product);
  }

  onMoreClick(): void {
    this.openMoreMenu = !this.openMoreMenu;
  }

  onDeleteButtonClick(): void {
    this.shoppingListService.deleteProduct(this.productIndex!);
  }

  onEditButtonClick(): void {
    this.shoppingListService.productBeingEdited.next(this.productIndex!);
  }
}
