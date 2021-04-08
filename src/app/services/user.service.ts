import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICES } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { USER } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  token: string;
  message: string;
  userStorage: any;
  response: any;
  currentUser: USER;

  constructor(
    public router: Router,
    public http: HttpClient
  ) {
    this.loadUserStorage();
  }


  // Check if user is login
  isLoggedIn(): boolean {
    return (this.token && this.token.length > 5) ? true : false;

  }
  // load the data session in the localstorage
  loadUserStorage(): any {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.userStorage = JSON.parse(localStorage.getItem('user'));

    } else {
      this.token = '';
      this.userStorage = null;
    }
  }
  // set the current data session in localStorage
  setUserStorage(token: string, user: USER): any {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  setUserModel(user: any): USER {
    return {
      id: user.id,
      name: user.name,
      surname: user.fullname,
      email: user.email,
      phone: user.phone || '',
      role: user.role || ''
    };
  }

  // logout
  logout(): any {
    this.userStorage = null;
    this.token = '';
    localStorage.clear();


    this.router.navigate(['/login']);
  }

  // login
  login(user): any {

    const url = URL_SERVICES + '/login';

    return this.http.post( url, user )
    .pipe(
      map((resp: any) => {
        this.token = resp.token;
        this.currentUser = this.setUserModel(resp.user);
        this.setUserStorage(resp.token, this.currentUser);
        return;
      }),
      catchError((err: any) => {
        return throwError(err.error.message);
      })
    );
  }

// Register user

signUp(user): any {
  const url = URL_SERVICES + '/user';

  return this.http.post(url, user)
  .pipe(
    map((resp: any) => {
      return this.message = resp.message;
    }),
    catchError((err: any) => {
        return throwError(err);
    })
  );
}

}
