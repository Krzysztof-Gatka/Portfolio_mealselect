import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  navbarOpen: boolean = false;
  isUserLoggedIn: boolean = false;
  sub: Subscription | undefined;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
      this.isUserLoggedIn = this.authService.userLoggedIn();
      this.sub = this.authService.userAuthentication.subscribe((operation) => {
        if(operation === 'login') {
          this.isUserLoggedIn = true;
        }
      })
  }

  onHamburgerClick():void {
    this.navbarOpen = !this.navbarOpen;
  }
}
