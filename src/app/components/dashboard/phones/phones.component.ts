import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PhoneService } from 'src/app/services/phone.service';

@Component({
  selector: 'app-phones',
  templateUrl: './phones.component.html',
  styleUrls: ['./phones.component.css']
})
export class PhonesComponent implements OnInit {

  cif: string = '';
  phoneList: any[] = [];
  hide = false;
  hideResult = true;
  searchedPhone: any[] = [];
  @ViewChild('input') inputName: any;
  userRole: string = '';
  isAdmin: boolean =  false;
  userStorage = localStorage.getItem('user') || '';


  constructor(
    private route: ActivatedRoute,
    private phoneService: PhoneService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif') || '';
    this.userRole = JSON.parse(this.userStorage).role;
    this.isAdmin = JSON.parse(this.userStorage).admin;
    this.getPhones();
  }

  // hide searched fields when escape key is pressed
  escape(event: any): void {
    if (event.keyCode === 27) {
      this.hide = true;
    }
  }

  // get a list of your phones by community
  getPhones(): void {
    this.phoneService.getPhonesList(this.cif).subscribe(
      (resp: any) => {
          this.phoneList = resp.results;
      }
    );
  }

  // get the searched phone
  getPhone(phone: any): void {
    if (phone !== '') {
      this.hide = false;
      this.phoneService.getSearchedPhone(this.cif, phone).subscribe(
        (resp: any) => {
          if (resp.message !== undefined) {
              this.hide = true;
            } else {
              this.searchedPhone = resp.results;
            }

      });
    } else {
        this.hide = true;
    }
  }

   // when click a searched result in the search bar, show that result
   getSelectedOption(result: any): void {
    this.phoneList = [result];
    this.hide = true;
    this.hideResult = false;
    this.inputName.nativeElement.value = ''; // clear the search bar
  }

  // when show the result of the search bar, hide/show text to view all results again
  changeHideResult(): void {
    this.getPhones();
    this.hideResult = true;
  }

  removePhone(phone: any): void {
    console.log(phone);
    this.phoneService.removePhone(phone.id).subscribe(
      (resp: any) => {
        this.getPhones();
      }
    );

  }

  editPhone(phone: any): void {
    this.router.navigate(['/registerPhone', this.cif, {id: phone.id, name: phone.name, numberphone: phone.numberphone}]);
  }

}
