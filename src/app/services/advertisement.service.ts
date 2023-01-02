import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { URL_SERVICES } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {

  message: string = '';

  httpOptions = {
    headers: new HttpHeaders({
      authorization: localStorage.getItem('token') || ''
    })
  };
  constructor(
    private http: HttpClient
  ) { }

   // ============================================
  // Get the advertisements of your community
  // ============================================
  getAdvertisementList(community: any): any {
    const url = URL_SERVICES + '/advertisement/' + community;

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
  // Get the searched advertisement in your community
  // ============================================

  getSearchedAdvertisement(cif: string, advertisement: any): any {
    const url = URL_SERVICES + '/advertisement/' + cif + '/' + advertisement;

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

  // ================================
  // Register new advertisements
  // ================================

  registerAdvertisement(advertisement: any): any {
    const url = URL_SERVICES + '/advertisement';

    return this.http.post(url, advertisement, this.httpOptions)
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
  // Remove an advertisement from your community
  // ============================================

  removeAdvertisement(cif: string, advertisement: any): any {
    const url = URL_SERVICES + '/advertisement/' + cif + '/' + advertisement;

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
  // Update an advertisement from your community
  // ============================================

  updateAdvertisement(advertisement: any, id: string): any {
    const url = URL_SERVICES + '/advertisement/' + id;

    return this.http.put(url, advertisement, this.httpOptions)
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
