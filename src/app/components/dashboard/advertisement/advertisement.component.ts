import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentsService } from 'src/app/services/documents.service';
import { AdvertisementService } from '../../../services/advertisement.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.css']
})
export class AdvertisementComponent implements OnInit {

  cif: string;
  advertisementList: any;
  searchedAdvertisement: any;
  hide = false;
  hideResult = true;
  errorMessage: string;
  statements: string;
  @ViewChild('input') inputName;
  userRole: string;
  isAdmin: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private advertisementService: AdvertisementService,
    private documentsService: DocumentsService
  ) { }

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif');
    this.userRole = JSON.parse(localStorage.getItem('user')).role;
    this.isAdmin = JSON.parse(localStorage.getItem('user')).admin;
    this.getAdvertisements();

  }

  // hide searched fields when escape key is pressed
  escape(event): void {
    if (event.keyCode === 27) {
      this.hide = true;
    }
  }

  // get a list of your refurbishments by community
  getAdvertisements(): void {
    this.advertisementService.getAdvertisementList(this.cif).subscribe(
      (resp: any) => {
        this.advertisementList = resp.results;
      },
      error => {
        this.errorMessage = error.error.message;
      }
    );
  }
  // get the searched advertisement
  getAdvertisement(advertisement): void {
    if (advertisement !== '' && advertisement.length > 2) {
      this.hide = false;
      this.advertisementService.getSearchedAdvertisement(this.cif, advertisement).subscribe(
        resp => {
          if (resp.message !== undefined) {
              this.hide = true;
            } else {
              this.searchedAdvertisement = resp.results;
            }

      });
    } else {
        this.hide = true;
    }
  }

  // when click a searched result in the search bar, show that result
  getSelectedOption(result): void {
    this.advertisementList = [result];
    this.hide = true;
    this.hideResult = false;
    this.inputName.nativeElement.value = ''; // clear the search bar
  }

  // when show the result of the search bar, hide/show text to view all results again
  changeHideResult(): void {
    this.getAdvertisements();
    this.hideResult = true;
  }

  // download File
  downloadFile(document, id): void {

    this.documentsService.downloadFile(id).subscribe(
      resp => {
       const blob = new Blob([resp], {type: resp.type});
       const filename = document.substring(document.lastIndexOf('/') + 1, document.length);

       saveAs(blob, filename);
      },
      error => {
        this.errorMessage = 'No s\'ha pogut trobat l\'arxiu';
      }
      );
  }

  removeAdvertisement(advertisement): void {
    this.advertisementService.removeAdvertisement(this.cif, advertisement.id).subscribe(
      resp => this.getAdvertisements()
    );
  }
  editAdvertisement(advertisement): void {
    this.router.navigate(['/registerAdvertisement', this.cif, advertisement]);
  }

}
