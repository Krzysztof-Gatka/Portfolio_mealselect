import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Subject } from "rxjs";
import { User } from "./user.model";


const WebAPIKey = 'AIzaSyA-qhl-Xy0a_-sxbwrPPeU_dLycYdAOTBo';
const SignInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + WebAPIKey;
const LogInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + WebAPIKey;

class LoginResponse {
  constructor(
    public displayName: string,
    public email: string,
    public expiresIn: string,
    public idToken: string,
    public kind: string,
    public localId: string,
    public refreshToken: string,
    public registered: boolean
  ) {}

}

@Injectable({providedIn: 'root'})
export class AuthService {
  user: User | undefined | null;
  userAuthentication =  new Subject<string>();

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
    this.http.post<LoginResponse>(LogInUrl, requestBody)
      .subscribe((response) => {
        const email = response.email;
        const expiresIn = parseInt(response.expiresIn);
        const lastLogin = new Date();
        const token = response.idToken;
        this.user = new User(email, lastLogin, token, expiresIn);
        this.userAuthentication.next('login');
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

  canActivate(): boolean | UrlTree {
    console.log('canActivate launched!');
    const tree: UrlTree = this.router.parseUrl('/welcome');
    if (this.user) return true;
    return tree;
  }

  userLoggedIn(): boolean {
    return !!this.user;
  }

}

export const canActivateUser: CanActivateFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(AuthService).canActivate();
  };
