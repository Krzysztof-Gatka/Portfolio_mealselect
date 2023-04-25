import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { PantryService } from '../pantry.service';
import { Subscription } from 'rxjs';
import { PantryElement } from './pantry.model';

const Miliseconds_In_Day = 1000*60*60*24;

@Component({
  selector: 'app-pantry-element',
  templateUrl: './pantry-element.component.html',
  styleUrls: ['./pantry-element.component.scss']
})
export class PantryElementComponent implements OnInit, OnDestroy, OnChanges{
  @Input() product!: PantryElement;
  @Input() index!: number;
  @ViewChild('btnMore') btnMore: ElementRef<HTMLButtonElement> | undefined;

  openMoreMenu:boolean = false;
  productExpired: boolean = false;
  productExpiredSoon: boolean = false;
  clickOutsideSub: Subscription | undefined;

  constructor(private pantryService: PantryService) {}

  ngOnInit(): void {
    this.clickOutsideSub = this.pantryService.clickOutsideMoreMenu.subscribe((event) => {
      if(!this.btnMore?.nativeElement.contains(<Node>event.target!)) {
        this.openMoreMenu = false;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.product.expDate) return

    if((new Date().getTime() - new Date(this.product.expDate!).getTime())/Miliseconds_In_Day >= -2) {
      this.productExpiredSoon = true;
    }

    if((new Date().getTime() - new Date(this.product.expDate!).getTime())/Miliseconds_In_Day >= -1) {
      this.productExpired = true;
    }
  }

  ngOnDestroy(): void {
    this.clickOutsideSub?.unsubscribe();
  }

  onDeleteClick(): void {
    this.pantryService.deleteElement(this.index);
  }

  onEditClick(): void {
    this.pantryService.pantryElementEdit.next(this.index);
  }

  onMoreClick(): void {
    this.openMoreMenu = !this.openMoreMenu;
  }

}
