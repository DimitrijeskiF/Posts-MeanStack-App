import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {environment} from "../../environments/environment";
import {B} from "@angular/cdk/keycodes";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private userId: string;
  authStateListener = new Subject<boolean>();
  private isAuthenticated = false;
  tokenTimeout: any;


  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getAuthStateListener() {
    return this.authStateListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post(BACKEND_URL + "/signup", authData)
      .subscribe(() => {
        this.router.navigate(["/"]);
      }, error => {
        this. authStateListener.next(false);
      });
  }

  // tslint:disable-next-line:typedef
  loginUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + '/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresIn = response.expiresIn;
          this. setAuthTimer(expiresIn);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStateListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      },
        error => {
          this. authStateListener.next(false);
        });
  }

  autoAtuhUser() {
    const authInformation = this.getAuthData();
    if (!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStateListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStateListener.next(false);
    clearTimeout(this.tokenTimeout);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  // tslint:disable-next-line:typedef
  private setAuthTimer(duration: number){
    this.tokenTimeout = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }
}
