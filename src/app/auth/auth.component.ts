import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

const WebAPIKey = 'AIzaSyA-qhl-Xy0a_-sxbwrPPeU_dLycYdAOTBo';
const SignInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + WebAPIKey;
const LogInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + WebAPIKey;

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
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.sub = this.route.url.subscribe((url) => {
      this.type = url[0].path;
    })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSubmit(): void {
    const url = this.type === 'login' ? LogInUrl : SignInUrl
    const userEmail = this.form.controls.email.value;
    const userPassword = this.form.controls.password.value;

    this.http.post<Response>(url, {
      email: userEmail,
      password: userPassword,
      returnSecureToken: true,
    })
    .subscribe((response) => {
      console.log(response);
    })

    this.form.reset();
  }

  onTestUserClick(): void {
    this.form.controls.email.setValue('test@test.com');
    this.form.controls.password.setValue('12341234');
  }
}
