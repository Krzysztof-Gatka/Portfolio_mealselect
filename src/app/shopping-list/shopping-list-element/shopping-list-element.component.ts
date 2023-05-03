import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ShoppingListService } from '../shopping-list.service';
import { Subscription } from 'rxjs';
import { ShoppingListElement } from './shopping-list-element.model';

@Component({
  selector: 'app-shopping-list-element',
  templateUrl: './shopping-list-element.component.html',
  styleUrls: ['./shopping-list-element.component.scss']
})
export class ShoppingListElementComponent implements OnInit, OnDestroy {
  @Input() product: ShoppingListElement | undefined;
  @Input() productIndex: number | undefined;
  @Input() editing: boolean = false;
  @ViewChild('btnMore') btnMore: ElementRef<HTMLButtonElement> | undefined;

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
  }

  ngOnDestroy(): void {
    this.editSub?.unsubscribe();
    this.saveSub?.unsubscribe();
    this.clickOutsideSub?.unsubscribe();
  }

  onMoreClick(): void {
    this.openMoreMenu = !this.openMoreMenu;
  }

  onDeleteButtonClick(): void {
    this.shoppingListService.shoppingListLoading.next(true);
    this.shoppingListService.deleteProduct(this.productIndex!);
  }

  onEditButtonClick(): void {
    this.shoppingListService.productEditing.next(this.productIndex!);
  }

  onProductClick(): void {
    this.shoppingListService.toggleBought(this.productIndex!);
  }

  onElementMenuClick(event: MouseEvent): void {
    this.openMoreMenu = false;
    event.stopPropagation();
  }
}
