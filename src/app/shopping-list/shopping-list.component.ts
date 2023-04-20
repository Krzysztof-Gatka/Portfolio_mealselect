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
  modalOpened: boolean = false;
  boughtElements: boolean = false;
  loading: boolean = true;
  editMode: boolean = false;
  editedProductIndex: number | undefined;

  changeSub: Subscription | undefined;
  deleteSub: Subscription | undefined;
  editSub: Subscription | undefined;

  form = new FormGroup({
    productName: new FormControl<string | null>(null, Validators.required),
    productQuantity: new FormControl<number | null | undefined>(null, Validators.pattern(/^[1-9][0-9]*/)),
    productUnit: new FormControl<string | null | undefined>(null)
  })

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.changeSub = this.shoppingListService.productsChanged.subscribe(()=> {
      this.loading = false;
      this.shoppingListElements = this.shoppingListService.getShoppingList();
      this.boughtElements = this.shoppingListService.getShoppingList().some(product => product.bought)
      this.editMode = false;
      this.form.reset();
    });

    this.deleteSub = this.shoppingListService.deletedProducts.subscribe((code) => {
      if(code === -1) {
        this.deletedProductsAvailable = false;
      } else {
        this.deletedProductsAvailable = true;
      }
    });

    this.editSub = this.shoppingListService.productBeingEdited.subscribe((id) => {
      this.editMode = true;
      this.editedProductIndex = id;
      this.form.controls.productName.setValue(this.shoppingListElements![id].name);
      this.form.controls.productQuantity.setValue(this.shoppingListElements![id].quantity);
      this.form.controls.productUnit.setValue(this.shoppingListElements![id].unit);
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
    this.deleteSub?.unsubscribe();
  }

  onItemAdded(product: ShoppingListElement): void {
    this.shoppingListElements = this.shoppingListService.addProduct(product);
  }

  onReviveLastProduct(): void {
    this.shoppingListElements = this.shoppingListService.reviveLastProduct();
  }

  onClearBoughtElements():void {
    this.shoppingListService.clearBoughtProducts();
  }

  onAddBoughtElementsToPantry(): void {
    this.shoppingListService.addBoughtElementsToPantry();
    this.onClearBoughtElements();
  }

  onClearList(): void {
    this.modalOpened = true;
  }

  onModalClick(): void {
    this.modalOpened = false;
  }

  onYesClick(): void {
    this.shoppingListElements = [];
    this.shoppingListService.clear();
  }

  onAddClick(): void {
    this.shoppingListService.addProduct(this._createProduct());
    this.form.reset();
  }

  private _createProduct(): ShoppingListElement {
    const name = this.form.controls.productName.value!;
    const quantity = this.form.controls.productQuantity.value;
    const unit = this.form.controls.productUnit.value;
    return new ShoppingListElement(name, quantity, unit);
  }

  onSaveClick(): void {
    const updateProduct = this._createProduct();
    this.shoppingListService.updateProduct(this.editedProductIndex!, updateProduct);
    this.form.reset();
    this.editMode = false;
  }

  onClickOutsideElementMenu(event: MouseEvent) {
    this.shoppingListService.clickOutsideMoreMenu.next(event);
  }
}
