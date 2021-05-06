import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICES } from '../config/config';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService {

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
  // Get all professions in the DB
  // ================================
  getProfessions(): any {
    const url = URL_SERVICES + '/professions';

    return this.http.get(url, this.httpOptions).pipe(
        map((resp) => {
          return resp;
        })
    );
  }

   // ================================
  // Register new professions
  // ================================

  registerProfession(profession): any {
    const url = URL_SERVICES + '/professions';

    return this.http.post(url, profession, this.httpOptions)
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
