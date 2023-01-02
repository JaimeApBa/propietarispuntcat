import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressService } from 'src/app/services/address.service';
import { ProviderService } from '../../../services/provider.service';
import { ProfessionService } from '../../../services/profession.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register-provider',
  templateUrl: './register-provider.component.html',
  styleUrls: ['./register-provider.component.css']
})
export class RegisterProviderComponent implements OnInit {

  cif: string = '';
  cifProvider: string = '';
  providerForm!: FormGroup;
  professions: any;
  submitted = false;
  message: string = '';
  errorMessage: string = '';
  searchFormattedAddress: string = '';
  matchAddress: any;
  hide = false;
  @ViewChild('profession') professionSelect: any;
  isUpdate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private addressService: AddressService,
    private providerService: ProviderService,
    private professionService: ProfessionService
  ) {}

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif') || '';
    this.cifProvider = this.route.snapshot.paramMap.get('cifProvider') || '';
    this.getProfessions();
    this.isUpdate = false;
    // data form of the provider
    this.providerForm = this.fb.group({
      cif: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      email: ['', Validators.email],
      phone: ['', [Validators.pattern('[0-9]{9}')]],
      latitude: [''],
      longitude: [''],
      profession: ['', Validators.required]
    });

    this.getDataParams();
  }

  getProfessions(): void {
    this.professionService.getProfessions().subscribe(
      (res: any) => {
        this.professions = res.results;
      }
    );
  }

  // getter for easy access to form fields
  get f(): any { return this.providerForm.controls; }

  getAddress(address: any): void {
    this.addressService.getInfoAdress(address).subscribe(
        (res: any) => {
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
 getSearchedAddress(searchAddress: any): void {
   let addressName = '';
   let streetNumber = '';

   searchAddress.address_components.forEach((el: any) => {
      if (el.types[0] === 'route') {
        addressName = el.long_name;
      }
      if (el.types[0] === 'street_number') {
        streetNumber = el.long_name;

      }
      this.providerForm.controls['address'].setValue( addressName + ', ' + streetNumber);

      if (el.types[0] === 'postal_code') {
        const pc = el.long_name;
        this.providerForm.controls['postalCode'].setValue(pc);
      }

      if (el.types[0] === 'locality') {
        const cityName = el.long_name;
        this.providerForm.controls['city'].setValue(cityName);
      }

      if (el.types[0] === 'country') {
        const countryName = el.long_name;
        this.providerForm.controls['country'].setValue(countryName);
      }

    });

   const lat = searchAddress.geometry.location.lat;
   const long = searchAddress.geometry.location.lng;

   this.providerForm.controls['latitude'].setValue(lat);
   this.providerForm.controls['longitude'].setValue(long);
   this.hide = true; // hide search results

 }

  // register on submit
  onSubmit(): void {
    this.submitted = true;

    if (this.providerForm.invalid) { return; }
    const profession = this.professions.filter( (r: any) => r.name === this.providerForm.value.profession).map((r: any) => r.id);

    this.providerForm.controls['profession'].setValue(profession[0]);

    if (!this.isUpdate) {
      this.providerService.registerProvider(this.providerForm.value, this.cif).subscribe(
          (resp: any) => {
            this.errorMessage = '';
            this.message = resp;
            // the html select change to the selected option by default
            this.professionSelect.nativeElement.options[0].selected = true;
          },
          (error: any) => {
            this.message = '';
            this.errorMessage = error.error.message;
          });
    } else{
      this.providerService.updateProvider(this.providerForm.value, this.cifProvider).subscribe(
           (resp: any) => {
             this.errorMessage = '';
             this.message = resp;
             // the html select change to the selected option by default
             this.professionSelect.nativeElement.options[0].selected = true;
           },
           (error: any) => {
             this.message = '';
             this.errorMessage = error.error.message;
           });
    }
    this.onReset();
  }

  onReset(): void {
    this.providerForm.reset();
    Object.keys(this.providerForm.controls).forEach(key => {
      this.providerForm.get(key)!.setErrors(null) ;
    });
  }

  // when update a provider, get the data from the params
  getDataParams(): void{
    const provider = this.route.snapshot.paramMap.get('cifProvider');
    const name = this.route.snapshot.paramMap.get('name');
    const address = this.route.snapshot.paramMap.get('address');
    const city = this.route.snapshot.paramMap.get('city');
    const postalCode = this.route.snapshot.paramMap.get('postalcode');
    const country = this.route.snapshot.paramMap.get('country');
    const email = this.route.snapshot.paramMap.get('email');
    const phone = this.route.snapshot.paramMap.get('phone');
    const latitude = this.route.snapshot.paramMap.get('latitude');
    const longitude = this.route.snapshot.paramMap.get('longitude');
    const profession = this.route.snapshot.paramMap.get('profession');


    if (provider !== null && name !== null) {
      this.providerForm.controls['cif'].setValue(provider);
      this.providerForm.controls['name'].setValue(name);
      this.providerForm.controls['address'].setValue(address);
      this.providerForm.controls['postalCode'].setValue(postalCode);
      this.providerForm.controls['city'].setValue(city);
      this.providerForm.controls['country'].setValue(country);
      this.providerForm.controls['email'].setValue(email);
      this.providerForm.controls['phone'].setValue(phone);
      this.providerForm.controls['latitude'].setValue(latitude);
      this.providerForm.controls['longitude'].setValue(longitude);
      this.providerForm.controls['profession'].setValue(profession);

      this.isUpdate = true;
    }
  }
}
