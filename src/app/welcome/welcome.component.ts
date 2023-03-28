import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit{
  userLoggedIn: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userLoggedIn = this.authService.isUserLoggedIn();
    this.authService.userAuthentication.subscribe((operation) => {
      if(operation === 'logIn' || operation === 'signIn') {
        this.userLoggedIn = true;
      }

      if(operation === 'logOut') {
        this.userLoggedIn = false;
      }
    })
  }
}
