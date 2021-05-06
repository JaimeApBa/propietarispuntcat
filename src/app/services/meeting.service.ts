import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { URL_SERVICES } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

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
  // Get all the meetings of your community
  // ============================================
  getMeetingList(community): any {
    const url = URL_SERVICES + '/meeting/' + community;

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
  // Get the searched meeting in your community
  // ============================================

  getSearchedMeeting(cif, meeting): any {
    const url = URL_SERVICES + '/meeting/' + cif + '/' + meeting;

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
  // Register new meeting
  // ================================

  registerMeeting(meeting): any {
    const url = URL_SERVICES + '/meeting';

    return this.http.post(url, meeting, this.httpOptions)
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
  // Remove meeting from your community
  // ============================================

  removeMeeting(cif, meeting): any {
    const url = URL_SERVICES + '/meeting/' + cif + '/' + meeting;

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
  // Update a meeting from your community
  // ============================================

  updateMeeting(meeting, id): any {
    const url = URL_SERVICES + '/meeting/' + id;

    return this.http.put(url, meeting, this.httpOptions)
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
