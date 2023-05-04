import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ShoppingListService } from './shopping-list.service';
import { ShoppingListElement } from './shopping-list-element/shopping-list-element.model';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
  animations: [
    trigger('added', [

      transition(':enter', [

        animate('800ms ease-in-out', keyframes([

          style({
            transform: 'translateY(100vh)'
          }),
          style({
            transform: 'translateY(0)'
          }),

      ]))]),

      transition(':leave', [

        animate('800ms ease-in-out',
          style({
            height:0,
            transform: 'translateY(100vh)',
          })
        )

      ]),


    ])
  ]
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  shoppingListElements: ShoppingListElement[] | undefined;

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
      this.boughtElements = this.shoppingListService.getShoppingList().some(product => product.bought);
      this.productEditing = false;
      this.editedProductIndex = -1;
      this.form.reset();
      this.loading = false;
    });

    this.editSub = this.shoppingListService.productEditing.subscribe((id) => {
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
      this.boughtElements = this.shoppingListService.getShoppingList().some(product => product.bought)
      this.loading = false;
    }

  }

  ngOnDestroy(): void {
    this.changeSub?.unsubscribe();
    this.editSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
  }

  onAddClick(): void {
    this.loading = true;
    this.shoppingListService.addProduct(this._createProduct());
    this.form.reset();
  }

  onSaveClick(): void {
    this.loading = true;
    const updateProduct = this._createProduct();
    this.form.reset();
    this.shoppingListService.updateProduct(this.editedProductIndex!, updateProduct);
    this.productEditing = false;
    this.editedProductIndex = -1;
  }

  onAddBoughtElementsToPantry(): void {
    this.shoppingListService.addBoughtElementsToPantry();
  }

  onClearList(): void {
    this.loading = true;
    this.shoppingListService.clearProducts();
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
