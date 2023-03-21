import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";


const WebAPIKey = 'AIzaSyA-qhl-Xy0a_-sxbwrPPeU_dLycYdAOTBo';
const SignInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + WebAPIKey;
const LogInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + WebAPIKey;

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  SignIn(userEmail: string, userPassword: string): void {
    const requestBody = this._createRequestBody(userEmail, userPassword);
    this.http.post<Response>(SignInUrl, requestBody)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/home']);
      })
  }

  logIn(userEmail: string, userPassword: string): void {
    const requestBody = this._createRequestBody(userEmail, userPassword);
    this.http.post<Response>(LogInUrl, requestBody)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/home']);
      });
  }

  private _createRequestBody(userEmail: string, userPassword: string) {
    return {
      email: userEmail,
      password: userPassword,
      returnSecureToken: true,
    }
  }

}
