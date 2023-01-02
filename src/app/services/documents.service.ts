import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { URL_SERVICES } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {


  message: string = '';

  httpOptions = {
    headers: new HttpHeaders({
      authorization: localStorage.getItem('token') || ''
    })
  };
  documents = [
    'Contractes',
    'Pressupostos',
    'Factures',
    'Actes',
    'Resums Econòmics',
    'Comunicats',
    'Altres documents'
  ];

  constructor(
    private http: HttpClient
  ) { }


  // ================================
  // Upload new document
  // ================================

  registerDocument(document: any, cif: string): any {
    const url = URL_SERVICES + '/documents/' + cif;

    return this.http.post(url, document, this.httpOptions)
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
  // Get the documents of your community
  // ============================================

  getDocumentsList(cif: string, documentType: any): any {
    const url = URL_SERVICES + '/documents/' + cif + '/' + documentType;

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
  // Get a searched document in your community
  // ============================================

  getSearchedDocuments(cif: string, documentType: any, document: any): any {
    const url = URL_SERVICES + '/documents/' + cif + '/' + documentType + '/' + document;

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
  // Download a file
  // ============================================

  downloadFile(document: any): any {
    const url = URL_SERVICES + '/download/' + document;

    const headers = new HttpHeaders({
      authorization: localStorage.getItem('token') || ''
    });

    return this.http.get(url, {headers, responseType: 'blob' }).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }
}
