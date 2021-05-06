import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { URL_SERVICES } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class RefurbishmentService {

  message: string;

  httpOptions = {
    headers: new HttpHeaders({
      authorization: localStorage.getItem('token')
    })
  };


  constructor(
    private http: HttpClient
  ) { }


  // ============================================
  // Get the refurbishments of your community
  // ============================================

  getRefurbishmentsList(cif): any {
    const url = URL_SERVICES + '/refurbishment/' + cif;

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
  // Get the searched refurbishment in your community
  // ============================================

  getSearchedRefurbishments(cif, refurbishment): any {
    const url = URL_SERVICES + '/refurbishment/' + cif + '/' + refurbishment;

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
  // Get the work state list of the refurbishment
  // ============================================
  getWorkState(): any {
    const url = URL_SERVICES + '/workstate/';

    return this.http.get(url, this.httpOptions).pipe(
      map((resp) => {
        return resp;
      }));
  }

  // ================================
  // Register new refurbishments
  // ================================

  registerRefurbishment(refurbishment, cif): any {
    const url = URL_SERVICES + '/refurbishment/' + cif;

    return this.http.post(url, refurbishment, this.httpOptions)
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
  // Remove refurbishment from your community
  // ============================================

  removeRefurbishment(cif, refurbishment): any {
    const url = URL_SERVICES + '/refurbishment/' + cif + '/' + refurbishment;

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
  // Update a refurbishment from your community
  // ============================================

  updateRefurbishment(refurbishment, id): any {
    const url = URL_SERVICES + '/refurbishment/' + id;

    return this.http.put(url, refurbishment, this.httpOptions)
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
