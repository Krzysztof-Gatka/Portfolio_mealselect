import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Subject } from "rxjs";
import { User } from "./user.model";


const WebAPIKey = 'AIzaSyA-qhl-Xy0a_-sxbwrPPeU_dLycYdAOTBo';
const SignInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + WebAPIKey;
const LogInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + WebAPIKey;

class AuthResponse {
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
    this.http.post<AuthResponse>(SignInUrl, requestBody)
      .subscribe((response) => {
        this.user = this._createUserObject(response);
        this.userAuthentication.next('signIn');
        this.router.navigate(['/home']);
      })
  }

  logIn(userEmail: string, userPassword: string): void {
    const requestBody = this._createRequestBody(userEmail, userPassword);
    this.http.post<AuthResponse>(LogInUrl, requestBody)
      .subscribe((response) => {
        this.user = this._createUserObject(response);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.userAuthentication.next('logIn');
        this.router.navigate(['/home']);
      });
  }

  autologin(): void {
    if( localStorage.getItem('user')) {
      const user:User = JSON.parse(localStorage.getItem('user')!);
      if( new Date(user.lastLogin).getTime() + 10 * 1000 < new Date().getTime()) {
        return
      }
      this.user = new User(user.email, user.lastLogin, user.token, user.expiresIn);
      this.userAuthentication.next('login');
      this.router.navigate(['/home']);
    } else {
      return;
    }
  }

  logOut(): void {
    this.user = null;
    this.userAuthentication.next('logOut');
    localStorage.removeItem('user');
    this.router.navigate(['/welcome']);
  }

  private _createRequestBody(userEmail: string, userPassword: string) {
    return {
      email: userEmail,
      password: userPassword,
      returnSecureToken: true,
    }
  }

  private _createUserObject(response: AuthResponse): User {
    const email = response.email;
    const expiresIn = parseInt(response.expiresIn);
    const lastLogin = new Date();
    const token = response.idToken;
    return new User(email, lastLogin, token, expiresIn);
  }

  canActivate(): boolean | UrlTree {
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
