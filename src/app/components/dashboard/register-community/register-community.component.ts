import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CommunityService } from '../../../services/community.service';
import { USER } from '../../../models/user.model';

@Component({
  selector: 'app-register-community',
  templateUrl: './register-community.component.html',
  styleUrls: ['./register-community.component.css']
})
export class RegisterCommunityComponent implements OnInit {

  communityForm: FormGroup;
  submitted = false;
  message: string;
  searchFormattedAddress: string;
  matchAddress;
  hide = false;
  currentUser: USER;
  token: string;


  constructor(
    private fb: FormBuilder,
    private communityService: CommunityService
    ) { }

    ngOnInit(): void {
      // data form of the community
      this.communityForm = this.fb.group({
        cif: ['', Validators.required],
        address: ['', Validators.required],
        postalCode: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        latitude: [''],
        longitude: [''],
        name: ['', Validators.required],
        floor: ['', Validators.required],
        door: ['', Validators.required],
        side: ['', Validators.required],
      });

  }


    // getter for easy access to form fields
  get f(): any { return this.communityForm.controls; }

  getAddress(address): any {
      this.communityService.getInfoAdress(address).subscribe(
          res => {
              if (res !== undefined && res.results.length > 0){
                this.hide = false;
                this.searchFormattedAddress = res.results[0].formatted_address;
                this.matchAddress = res.results[0];
              } else {
                this.hide = true;
              }
          });

  }
   // When select a match adress result, fill all fields of the form
   getSearchedAddress(searchAddress): void {
     let addressName = '';
     let streetNumber = '';

     searchAddress.address_components.forEach(el => {
        if (el.types[0] === 'route') {
          addressName = el.long_name;
        }
        if (el.types[0] === 'street_number') {
          streetNumber = el.long_name;

        }
        this.communityForm.controls.address.setValue( addressName + ', ' + streetNumber);

        if (el.types[0] === 'postal_code') {
          const pc = el.long_name;
          this.communityForm.controls.postalCode.setValue(pc);
        }

        if (el.types[0] === 'locality') {
          const cityName = el.long_name;
          this.communityForm.controls.city.setValue(cityName);
        }

        if (el.types[0] === 'country') {
          const countryName = el.long_name;
          this.communityForm.controls.country.setValue(countryName);
        }

      });

     const lat = searchAddress.geometry.location.lat;
     const long = searchAddress.geometry.location.lng;

     this.communityForm.controls.latitude.setValue(lat);
     this.communityForm.controls.longitude.setValue(long);
     this.hide = true; // hide search results

   }
   // register on submit
   onSubmit(): any {
    this.submitted = true;
    if (this.communityForm.invalid) { return; }
    this.communityService.registerCommunity(this.communityForm.value)
                      .subscribe(resp => {this.message = resp; });

    this.onReset();
  }

  onReset(): void {
    this.communityForm.reset();
    Object.keys(this.communityForm.controls).forEach(key => {
      this.communityForm.get(key).setErrors(null) ;
    });
  }

}
