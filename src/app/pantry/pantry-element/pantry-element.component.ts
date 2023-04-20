import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PantryService } from '../pantry.service';
import { Subscription } from 'rxjs';
import { PantryElement } from './pantry.model';

@Component({
  selector: 'app-pantry-element',
  templateUrl: './pantry-element.component.html',
  styleUrls: ['./pantry-element.component.scss']
})
export class PantryElementComponent implements OnInit, OnDestroy{
  @Input() product!: PantryElement;
  @Input() index!: number;
  @ViewChild('btnMore') btnMore: ElementRef<HTMLButtonElement> | undefined;

  openMoreMenu:boolean = false;

  clickOutsideSub: Subscription | undefined;

  constructor(private pantryService: PantryService) {}

  ngOnInit(): void {
    this.clickOutsideSub = this.pantryService.clickOutsideMoreMenu.subscribe((event) => {
      if(!this.btnMore?.nativeElement.contains(<Node>event.target!)) {
        this.openMoreMenu = false;
      }
    })
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
