import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { URL_SERVICES } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  message: string;

  httpOptions = {
    headers: new HttpHeaders({
      authorization: localStorage.getItem('token')
    })
  };

  constructor(
    private http: HttpClient
  ) { }

  // ================================
  // Register new phones
  // ================================

  registerPhone(phone, cif): any {
    const url = URL_SERVICES + '/phone/' + cif;

    return this.http.post(url, phone, this.httpOptions)
        .pipe(
          map((resp: any) => {
            return this.message = resp.message;
          }),
          catchError((err: any) => {
            return throwError(err);
          })
        );
  }

  // ============================================
  // Get the phones of your community
  // ============================================

  getPhonesList(cif): any {
    const url = URL_SERVICES + '/phone/' + cif;

    return this.http.get(url, this.httpOptions)
        .pipe(
          map((resp: any) => {
            return resp;
          }),
          catchError((err: any) => {
            return throwError(err);
          })
        );
  }

  // ============================================
  // Get the searched phone in your community
  // ============================================

  getSearchedPhone(cif, phone): any {
    const url = URL_SERVICES + '/phone/' + cif + '/' + phone;

    return this.http.get(url, this.httpOptions)
        .pipe(
          map((resp: any) => {
            return resp;
          }),
          catchError((err: any) => {
            return throwError(err);
          })
        );
  }

  // ============================================
  // Remove phone from your community
  // ============================================

  removePhone(id): any {
    const url = URL_SERVICES + '/phone/' + id;

    return this.http.delete(url, this.httpOptions)
        .pipe(
          map((resp: any) => {
            return resp;
          }),
          catchError((err: any) => {
            return throwError(err);
          })
        );
  }

  // ============================================
  // Update a phone from your community
  // ============================================

  updatePhone(id, phone): any {
    const url = URL_SERVICES + '/phone/' + id;

    return this.http.put(url, phone, this.httpOptions)
        .pipe(
          map((resp: any) => {
            return resp;
          }),
          catchError((err: any) => {
            return throwError(err);
          })
        );
  }
}
