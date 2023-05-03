import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ShoppingListService } from './shopping-list.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShoppingListElement } from './shopping-list-element/shopping-list-element.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  shoppingListElements: ShoppingListElement[] | undefined;

  deletedProductsAvailable: boolean = false;
  pageMenuOpened: boolean = false;
  boughtElements: boolean = false;
  loading: boolean = true;

  productEditing: boolean = false;
  editedProductIndex: number | undefined;

  changeSub: Subscription | undefined;
  editSub: Subscription | undefined;
  loadingSub: Subscription | undefined;

  form = new FormGroup({
    productName: new FormControl<string | null>(null, Validators.required),
    productQuantity: new FormControl<number | null | undefined>(null, Validators.pattern(/^[1-9][0-9]*/)),
    productUnit: new FormControl<string | null | undefined>(null)
  })

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.changeSub = this.shoppingListService.productsChanged.subscribe(()=> {
      this.shoppingListElements = this.shoppingListService.getShoppingList();
      this.boughtElements = this.shoppingListService.getShoppingList().some(product => product.bought)
      this.productEditing = false;
      this.form.reset();
      this.loading = false;
    });

    this.editSub = this.shoppingListService.productBeingEdited.subscribe((id) => {
      this.productEditing = true;
      this.editedProductIndex = id;
      this.form.controls.productName.setValue(this.shoppingListElements![id].name);
      this.form.controls.productQuantity.setValue(this.shoppingListElements![id].quantity);
      this.form.controls.productUnit.setValue(this.shoppingListElements![id].unit);
    })

    this.loadingSub = this.shoppingListService.shoppingListLoading.subscribe((loading) => {
      this.loading = loading;
    })

    if(!this.shoppingListService.productsFetched) {
      this.shoppingListService.fetchShoppingList();
    } else {
      this.shoppingListElements = this.shoppingListService.getShoppingList();
      this.loading = false;
    }

  }

  ngOnDestroy(): void {
    this.changeSub?.unsubscribe();
    this.editSub?.unsubscribe();
  }

  onAddClick(): void {
    this.loading = true;
    this.shoppingListService.addProduct(this._createProduct());
    this.form.reset();
  }

  onReviveLastProduct(): void {
    this.loading = true;
    this.shoppingListService.reviveLastProduct();
  }

  onAddBoughtElementsToPantry(): void {
    this.shoppingListService.addBoughtElementsToPantry();
  }

  onSaveClick(): void {
    this.loading = true;
    const updateProduct = this._createProduct();
    this.shoppingListService.updateProduct(this.editedProductIndex!, updateProduct);
    this.form.reset();
    this.productEditing = false;
    this.editedProductIndex = -1;
  }

  onClearList(): void {

  }

  onClickOutsideElementMenu(event: MouseEvent) {
    this.shoppingListService.clickOutsideMoreMenu.next(event);
  }

  onMoreClick(): void {
    this.pageMenuOpened = !this.pageMenuOpened;
  }

  closeMoreMenu(): void {
    this.pageMenuOpened = false;
  }

  private _createProduct(): ShoppingListElement {
    const name = this.form.controls.productName.value!;
    const quantity = this.form.controls.productQuantity.value;
    const unit = this.form.controls.productUnit.value;
    return new ShoppingListElement(name, quantity, unit);
  }
}
