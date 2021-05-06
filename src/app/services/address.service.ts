import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { URL_GEOCODING, URL_SERVICES } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  httpOptions = {
    headers: new HttpHeaders({
      authorization: localStorage.getItem('token')
    })
  };

  constructor(
    private http: HttpClient
  ) { }


  // get the adress of the community searched in the community search bar
  getSearchAddress(address): any {

    const url = URL_SERVICES + '/community/' + address;

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
}
