import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

import { PantryService } from './pantry.service';
import { PantryElement } from './pantry-element/pantry.model';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { units } from '../recipes/recipe/recipe.model';

@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.scss'],
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
export class PantryComponent implements OnInit, OnDestroy{
  @ViewChild('name_input') nameInput?: ElementRef<HTMLInputElement>;
  pantry: PantryElement[] | undefined;

  pantryChangesSub: Subscription | undefined;
  pantryElementEditSub: Subscription | undefined;
  pantryLoadingSub: Subscription | undefined;

  pageMenuOpened: boolean = false;
  loading: boolean = true;
  elementEditing: boolean = false;
  elementIndex: number | undefined | null;
  units = units;

  form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    qty: new FormControl<number | null | undefined>(null),
    unit: new FormControl<string | null | undefined>(null),
    date: new FormControl<Date | string | null | undefined>(null),
  })

  constructor(private pantryService: PantryService) {}

  ngOnInit(): void {
    this.pantryChangesSub = this.pantryService.pantryChanged.subscribe(()=>{
      this.pantry = this.pantryService.getPantry();
      this.loading = false;
      this.elementEditing = false;
      this.elementIndex = null;
      this.form.reset();
    });

    this.pantryLoadingSub = this.pantryService.pantryLoading.subscribe((loading) => {
      this.loading = loading;
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
    this.pantryElementEditSub?.unsubscribe();
    this.pantryLoadingSub?.unsubscribe();
  }

  onAddClick(): void {
    const newProduct = this._getFormElement();
    this.loading = true;
    this.pantryService.addElement(newProduct);
    this.nameInput?.nativeElement.focus();

    this.form.reset();
  }

  onSaveClick(): void {
    const updatedProduct = this._getFormElement();
    this.loading = true;
    this.pantryService.updateElement(updatedProduct, this.elementIndex!);
    this.form.reset();
    this.elementEditing = false;
    this.elementIndex = null;
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
    this.loading = true;
    this.pantryService.clearPantry();
  }

  onSortByDateClick(): void {
    this.loading = true;
    this.pantryService.sortPantry();
  }
}

