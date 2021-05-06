import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICES } from '../config/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  isAdmin: boolean;
  userRole: string;

  httpOptions = {
    headers: new HttpHeaders({
      authorization: localStorage.getItem('token')
    })
  };

  constructor(
    private http: HttpClient
  ) { }

  // ================================
  // Get users in your community
  // ================================

  getUsersCommunity(community): any {
    const url = URL_SERVICES + '/joinCommunity/' + community;

    return this.http.get(url, this.httpOptions).pipe(
      map((resp: any) => {

        resp.response.forEach(element => {
          // save the role of the current user in localStorage
          if (JSON.parse(localStorage.getItem('user')).id  === element.id) {
            const user = JSON.parse(localStorage.getItem('user'));
            user.role = element.role;
            user.admin = element.admin;
            localStorage.setItem('user', JSON.stringify(user));
          }
        });
        return resp.response;
      })
    );
  }

  // ====================================================
  // Change the role of the user in your community
  // ====================================================
  changeRoleUserCommunity(id, cif, role): any {
    const url = URL_SERVICES + '/changeRole/' + id + '/' + cif;
    return this.http.put(url, role, this.httpOptions).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  // ====================================================
  // Remove user from the community
  // ====================================================
  removeUserCommunity(user, cif): any {
    const url = URL_SERVICES + '/joinCommunity/' + user + '/' + cif;
    console.log(url);
    return this.http.delete(url, this.httpOptions).pipe(
      map((error: any) => {
        return error;
      })
    );
  }

}
