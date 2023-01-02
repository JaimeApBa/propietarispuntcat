import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICES } from '../config/config';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  message: string= '';

  httpOptions = {
    headers: new HttpHeaders({
      authorization: localStorage.getItem('token') || ''
    })
  };

  constructor(
    private http: HttpClient
  ) { }


  // ================================
  // Register new providers
  // ================================

  registerProvider(provider: any, cif: string): any {
  const url = URL_SERVICES + '/provider/' + cif;

    return this.http.post(url, provider, this.httpOptions)
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
  // Get the providers of your community
  // ============================================

  getProvidersList(cif: string): any {
    const url = URL_SERVICES + '/provider/' + cif;

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
  // Get the searched provider in your community
  // ============================================

  getSearchedProviders(cif: string, provider: any): any {
    const url = URL_SERVICES + '/provider/' + cif + '/' + provider;

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
  // Change the role of the provider in your community
  // ============================================
  changeRoleProviderCommunity(provider: any, community: any, role: any): any {
    const url = URL_SERVICES + '/provider/' + provider + '/' + community;
    provider = {provider};

    return this.http.put(url, role, this.httpOptions).pipe(
      map(
        resp => {
          return resp;
        }
      ),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  // ============================================
  // Update the data of a provider
  // ============================================

  updateProvider(provider: any, cif: string): any {
    const url = URL_SERVICES + '/provider/' + cif;

    return this.http.put(url, provider, this.httpOptions)
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
