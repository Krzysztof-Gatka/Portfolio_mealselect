import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  type: string = '';
  sub: Subscription | undefined;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.url.subscribe((url) => {
      this.type = url[0].path;
    })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSubmit(): void {
    const userEmail = this.form.controls.email.value;
    const userPassword = this.form.controls.password.value;
    // because of form validation i am sure that
    // userEmail and userPassword will be set
    if(this.type === 'login') {
      this.authService.logIn(userEmail!, userPassword!);
    } else {
      this.authService.logIn(userEmail!, userPassword!);
    }


    this.form.reset();
  }

  onTestUserClick(): void {
    this.form.controls.email.setValue('test@test.com');
    this.form.controls.password.setValue('12341234');
  }
}
