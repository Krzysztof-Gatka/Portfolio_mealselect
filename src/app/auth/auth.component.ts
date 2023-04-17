import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';

const Errors_Map = {
  'INVALID_PASSWORD': 'Your password is incorrect. Please try again.',
  'EMAIL_NOT_FOUND': 'Account associated with this email does not exist. Please try again.',
  'EMAIL_EXISTS': 'Account associated with this email already exists. Please try different one.',
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  routeSub: Subscription | undefined;
  authSub: Subscription | undefined;

  type: string = '';
  errorMessage: string | undefined | null;
  loading: boolean = false;
  inputEmail: string | undefined;

  emailInvalidMsg = 'Your email is invalid.';
  passwordInvalidMsg = 'Your password is invalid. Password has to be minimum 8 characters long.';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.url.subscribe((url) => {
      this.type = url[0].path;
    });

    this.authSub = this.authService.userAuthentication.subscribe((option) => {
      if (option === 'logInError') {
        this.errorMessage = Errors_Map[this.authService.errorType as keyof typeof Errors_Map];
        this.loading = false;

        if(this.authService.errorType === 'INVALID_PASSWORD') {
          this.form.controls.email.setValue(this.inputEmail!);
        }
      } else if (option = 'SignUpError') {
        this.errorMessage = Errors_Map[this.authService.errorType as keyof typeof Errors_Map];
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.authSub?.unsubscribe();
  }

  onSubmit(): void {
    const userEmail = this.form.controls.email.value;
    const userPassword = this.form.controls.password.value;

    this.errorMessage = null;
    this.loading = true;

    if(this.type === 'login') {
      this.inputEmail = userEmail!;
      this.authService.logIn(userEmail!, userPassword!);
    } else {
      this.authService.singIn(userEmail!, userPassword!);
    }
    this.form.reset();
  }

  onTestUserClick(): void {
    this.form.controls.email.setValue('test@test.com');
    this.form.controls.password.setValue('12341234');
  }
}
