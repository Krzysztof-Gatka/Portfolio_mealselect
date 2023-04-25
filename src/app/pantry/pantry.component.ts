import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';


import { PantryService } from './pantry.service';
import { PantryElement } from './pantry-element/pantry.model';
import { PantrySortService } from './pantry-sort.service';

@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.scss']
})
export class PantryComponent implements OnInit, OnDestroy{
  pantry: PantryElement[] | undefined;

  pantryChangesSub: Subscription | undefined;
  pantryElementEditSub: Subscription | undefined;

  loading: boolean = true;
  elementEditing: boolean = false;
  elementIndex: number | undefined;
  pageMenuOpened: boolean = false;
  sorting: boolean = false;
  form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    qty: new FormControl<number | null | undefined>(null),
    unit: new FormControl<string | null | undefined>(null),
    date: new FormControl<Date | string | null | undefined>(null),
  })

  constructor(private pantryService: PantryService, private pantrySortService: PantrySortService) {}

  ngOnInit(): void {
    this.pantryChangesSub = this.pantryService.pantryChanged.subscribe(()=>{
      this.pantry = this.pantryService.getPantry();
      this.loading = false;
      this.elementEditing = false;
      this.sorting = false;
      this.form.reset();
    });

    this.pantryElementEditSub = this.pantryService.pantryElementEdit.subscribe((id) => {
      this.elementEditing = true;
      this.elementIndex = id;
      const product = this.pantry![id];
      this.form.controls.name.setValue(product.name!);
      this.form.controls.qty.setValue(product.quantity);
      this.form.controls.unit.setValue(product.unit);
      if (product.expDate) {
        this.form.controls.date.setValue(formatDate(product.expDate, 'yyyy-MM-dd', 'en'));
      }
    })

    if(!this.pantryService.pantryFetched) {
      this.pantryService.fetchPantry();
    } else {
      this.pantry = this.pantryService.getPantry();
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.pantryChangesSub?.unsubscribe();
  }

  onAddClick(): void {
    const newProduct = this._getFormElement();
    this.pantryService.addElement(newProduct);
    this.form.reset();
  }

  onSaveClick(): void {
    const updatedProduct = this._getFormElement();
    this.pantryService.updateElement(updatedProduct, this.elementIndex!);
    this.form.reset();
    this.elementEditing = false;
  }

  _getFormElement(): PantryElement {
    const name = this.form.controls.name.value!;
    const qty = this.form.controls.qty.value;
    const unit = this.form.controls.unit.value;
    let expDate = null;
    if(this.form.controls.date.value) {
      expDate = new Date(this.form.controls.date.value);
    }

    const newProduct = new PantryElement(name, qty, unit, expDate);

    return newProduct;
  }

  onClickOutsideElementMenu(event: MouseEvent) {
    this.pantryService.clickOutsideMoreMenu.next(event);
  }

  onMoreClick():void {
    this.pageMenuOpened = !this.pageMenuOpened;
  }

  closeMoreMenu(): void {
    this.pageMenuOpened = false;
  }

  onClearPantryClick(): void {
    this.pantryService.clearPantry();
    this.sorting = false;
  }

  onSortByDateClick(): void {
    this.pantry = this.pantrySortService.sortByExpirationDate();
    this.sorting = true;
  }

  onClearSort(): void {
    this.pantry = this.pantryService.getPantry();
    this.sorting = false;
  }
}

