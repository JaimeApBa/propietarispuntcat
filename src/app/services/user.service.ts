import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICES } from '../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  httpOptions = {
    headers: new HttpHeaders({
      authorization: localStorage.getItem('token')
    })
  };

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
  loadUserStorage(): void {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.userStorage = JSON.parse(localStorage.getItem('user'));

    } else {
      this.token = '';
      this.userStorage = null;
    }
  }
  // set the current data session in localStorage
  setUserStorage(token: string, user: USER): void {
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
      role: user.role || '',
      admin: user.isAdmin || false
    };
  }

  // logout
  logout(): void {
    this.userStorage = null;
    this.token = '';
    localStorage.clear();
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

// get current user
getUser(id): any {
  const url = URL_SERVICES + '/user/' + id;

  return this.http.get(url, this.httpOptions)
  .pipe(
    map((resp: any) => {
      return resp.results;
    }),
    catchError((err: any) => {
        return throwError(err);
    })
  );
}

  // ============================================
  // Update the data of a user // No password
  // ============================================

  updateUser(user, id): any {
    const url = URL_SERVICES + '/user/' + id;

    return this.http.put(url, user, this.httpOptions)
        .pipe(
          map((resp: any) => {
            return resp.message;
          }),
          catchError((err: any) => {
            return throwError(err);
          })
        );
  }

  // ============================================
  // Update password  of a user
  // ============================================

  updatePasswordUser(user): any {
    const url = URL_SERVICES + '/password';

    return this.http.put(url, user)
        .pipe(
          map((resp: any) => {
            return resp.message;
          }),
          catchError((err: any) => {
            return throwError(err);
          })
        );
  }

}
