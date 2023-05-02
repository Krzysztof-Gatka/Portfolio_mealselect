import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  authSub: Subscription | undefined;

  navOpened: boolean = false;
  modalOpened: boolean = false;
  authenticated: boolean = false;

  constructor (
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authenticated = this.authService.isUserLoggedIn();
    this.authSub = this.authService.userAuthentication.subscribe((operation) => {
      if(operation === 'logIn' || operation === 'signIn') {
        this.authenticated = true;
      } else if(operation === 'logOut') {
        this.authenticated = false;
      }
    })
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  onHamburgerClick(): void {
    this.navOpened = !this.navOpened;
  }

  onLogoutClick(): void {
    this.authService.logOut();
  }
}
