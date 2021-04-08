import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICES, URL_GEOCODING } from '../config/config';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { USER } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  message: string;
  currentUser: USER;

  httpOptions = {
    headers: new HttpHeaders({
      authorization: localStorage.getItem('token')
    })
  };

  constructor(
    public http: HttpClient
  ) { }

  // ================================
  // Get your communities
  // ================================

  getCommunities(userid): any {
    const url = URL_SERVICES + '/communities/' + userid;

    return this.http.get(url, this.httpOptions);
  }

  // ================================
  // Register new communities
  // ================================

  // get the adress of the community searched in the community search bar
  getSearchAddress(address): any {
    const userid = JSON.parse(localStorage.getItem('user')).id;
    const url = URL_SERVICES + '/community/' + address + '/' + userid;
    return this.http.get(url, this.httpOptions);
  }

  // get the match adresses in the Google API Geocoding to get lat and long attributes
  getInfoAdress(adress): any {
    const url = URL_GEOCODING + adress;

    return this.http.get(url).pipe(
      map((resp: any) => {
        if (adress.length >= 5 && resp.status !== 'ZERO_RESULTS') {
          return resp;
        }
      })
    );
  }

  // register the new community
  registerCommunity(community): any {
    const url = URL_SERVICES + '/community';

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

  // join a community
  joinCommunity(data): any {
    // this.currentUser = JSON.parse(localStorage.getItem('user'));
    const url = URL_SERVICES + '/joinCommunity';

    return this.http.post(url, data, this.httpOptions)
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
