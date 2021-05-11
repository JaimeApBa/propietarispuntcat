import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DocumentsService } from '../../../services/documents.service';
import { registerLocaleData } from '@angular/common';
import localeCa from '@angular/common/locales/ca';
import { saveAs } from 'file-saver';
registerLocaleData(localeCa);

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  cif: string;
  userRole: string;
  isAdmin: boolean;
  documentsForm: FormGroup;
  documentList: any;
  hide = false;
  hideResult = true;
  searchedDocument: any;
  documentsType = [];
  documents: any;
  documentType = 'Contractes';
  errorMessage: string;
  @ViewChild('input') inputName;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private documentsService: DocumentsService
  ) { }

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif');
    this.userRole = JSON.parse(localStorage.getItem('user')).role;
    this.isAdmin = JSON.parse(localStorage.getItem('user')).admin;
    this.documentsType = this.documentsService.documents;
    this.documentsForm = this.fb.group({
      name: new FormControl('')
    });
    this.getDocumentsList();

  }
// hide searched fields when escape key is pressed
escape(event): void {
  if (event.keyCode === 27) {
    this.hide = true;
  }
}


  // get a list of your documents by community
  getDocumentsList(): void {
    this.errorMessage = '';
    this.documentsService.getDocumentsList(this.cif, this.documentType).subscribe(
      (resp: any) => {
        this.documents = resp.results;
      }
    );
  }

  // get the documents on type selected
  getDocuments(event): void {
    this.errorMessage = '';
    this.documentType = event;

    this.documentsService.getDocumentsList(this.cif, event).subscribe(
      (resp: any) => {
        this.documents = resp.results;
      }
    );
  }

  // get the searched provider
  getDocument(document): void {
    this.errorMessage = '';
    if (document !== '' && document.length > 2) {
      this.hide = false;

      this.documentsService.getSearchedDocuments(this.cif, this.documentType, document).subscribe(
        resp => {
          if (resp.message !== undefined) {
              this.hide = true;
            } else {
              this.searchedDocument = resp.results;
            }

          });
        } else {
          this.hide = true;
        }
  }

    // when click a searched result in the search bar, show that result
    getSelectedOption(result): void {
      this.documents = [result];
      this.hide = true;
      this.hideResult = false;
      this.inputName.nativeElement.value = ''; // clear the search bar
      this.errorMessage = '';
    }

     // when show the result of the search bar, hide/show text to view all results again
    changeHideResult(): void {
      this.getDocumentsList();
      this.hideResult = true;
    }

    // download File
    downloadFile(document): void {

      this.documentsService.downloadFile(document.id).subscribe(
        resp => {
         const blob = new Blob([resp], {type: resp.type});
         const filename = document.filename.substring(document.filename.lastIndexOf('/') + 1, document.filename.length);

         saveAs(blob, filename);
        },
        error => {
          this.errorMessage = 'No s\'ha pogut trobar l\'arxiu';
        }
        );
    }

}
