import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfessionService } from '../../../services/profession.service';
import { ProviderService } from '../../../services/provider.service';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {

  cif: string = '';
  professionForm!: FormGroup;
  professions: any[] = [];
  providersList: any[] = [];
  providersListByProfession: any;
  hide = false;
  hideResult = true;
  searchedProvider: any[] = [];
  @ViewChild('input') inputName: any;
  @ViewChild('profession') selectProfession: any;
  userRole: string = '';
  isAdmin: boolean = false;
  userStorage = localStorage.getItem('user') || '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private professionService: ProfessionService,
    private providerService: ProviderService
  ) { }

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif') || '';
    this.userRole = JSON.parse(this.userStorage).role;
    this.isAdmin = JSON.parse(this.userStorage).admin;
    this.getProfessions();
    this.getProviders();
    this.professionForm = this.fb.group({
      profession: new FormControl('')
    });
  }

  // hide searched fields when escape key is pressed
  escape(event: any): void {
    if (event.keyCode === 27) {
      this.hide = true;
    }
  }

  // get the professions of the DB
  getProfessions(): void {
    this.professionService.getProfessions().subscribe(
      (resp: any) => {
        this.professions = resp.results;
      }
    );
  }

  // get a list of your providers by community
  getProviders(): void {
    this.providerService.getProvidersList(this.cif).subscribe(
      (resp: any) => {
        if (!this.professionForm.value.profession || this.professionForm.value.profession === 'Oficis'
            || this.professionForm.value.profession === 'Tots')
        {
          this.providersList = resp.results;
          this.selectProfession.nativeElement.options[0].selected = true; // the html select change to the selected option by default
        }

        else if (this.professionForm.value.profession !== 'Oficis' && this.professionForm.value) {
          this.providersList = resp.results.filter((r: any) => r.profession === this.professionForm.value.profession);
        }
      }
    );
  }

  // get the searched provider
  getProvider(provider: any): void {
    if (provider !== '') {
      this.hide = false;
      this.providerService.getSearchedProviders(this.cif, provider).subscribe(
        (resp: any) => {
          if (resp.message !== undefined) {
              this.hide = true;
            } else {
              this.searchedProvider = resp.results;
            }

      });
    } else {
        this.hide = true;
    }
  }

   // when click a searched result in the search bar, show that result
   getSelectedOption(result: any): void {
    this.providersList = [result];
    this.hide = true;
    this.hideResult = false;
    this.inputName.nativeElement.value = ''; // clear the search bar
  }

  // when show the result of the search bar, hide/show text to view all results again
  changeHideResult(): void {
    this.getProviders();
    this.hideResult = true;
  }

  // update the data of a provider
  editProvider(provider: any): void {
    // change the name field of CIF, to avoid problems with CIF of community
    provider.cifProvider = provider.cif;
    delete provider.cif;

    this.router.navigate(['/registerProvider', this.cif, provider]);
  }

}

