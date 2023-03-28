import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  navbarOpen: boolean = false;
  isUserLoggedIn: boolean = false;
  sub: Subscription | undefined;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
      this.isUserLoggedIn = this.authService.userLoggedIn();
      this.sub = this.authService.userAuthentication.subscribe((operation) => {
        if(operation === 'logIn' || operation === 'signIn') {
          this.isUserLoggedIn = true;
        } else if(operation === 'logOut') {
          this.isUserLoggedIn = false;
        }
      })
  }

  ngOnDestroy(): void {
      this.sub?.unsubscribe();
  }

  onHamburgerClick():void {
    this.navbarOpen = !this.navbarOpen;
  }

  onLogoutClick(): void {
    this.authService.logOut();
  }
}
