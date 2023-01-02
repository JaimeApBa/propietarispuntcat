import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICES } from '../config/config';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { USER } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class HomeCommunityService {

  message: string = '';

  currentUser!: USER;

  httpOptions = {
    headers: new HttpHeaders({
      authorization: localStorage.getItem('token') || ''
    })
  };

  constructor(
    private http: HttpClient
  ) { }

  // ================================
  // Get your communities
  // ================================

  getCommunities(user: any): any {

    const url = URL_SERVICES + '/communities/' + user;

    return this.http.get(url, this.httpOptions).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  // =================================================
  // Get your own pending access requests communities
  // =================================================

  getPendingAccessCommunities(user: any): any {
    const url = URL_SERVICES + '/pendingAccess/' + user;
    return this.http.get(url, this.httpOptions).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  // ===========================================================
  // Get pending access requests communities if role allowed
  // ===========================================================

  getRequestAccessCommunities(user: any): any {
    const url = URL_SERVICES + '/requestAccessCommunity/' + user;
    return this.http.get(url, this.httpOptions).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  // ================================
  // Register new communities
  // ================================

  registerCommunity(community: any, user: any): any {
    const url = URL_SERVICES + '/community/' + user;

    return this.http.post(url, community, this.httpOptions)
        .pipe(
          map((resp: any) => {
            return this.message = resp.message;
          }),
          catchError((err: any) => {
            return throwError(err);
          })
        );
  }
  // ================================
  // join a community
  // ================================
  joinCommunity(data: any, user: any): any {
    const url = URL_SERVICES + '/joinCommunity/' + user;
    return this.http.post(url, data, this.httpOptions)
        .pipe(
          map((resp: any) => {
            return resp;
          }),
          catchError((err: any) => {
            return throwError(err);
          })
        );
  }

  // ========================================================
  // accept or refuse a request user to access the community
  // ========================================================
  manageRequestUserCommunity(data: any, belongsTo: any): any {
    const url = URL_SERVICES + '/joinCommunity';
    data.belongsTo = belongsTo;

    return this.http.put(url, data, this.httpOptions)
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
