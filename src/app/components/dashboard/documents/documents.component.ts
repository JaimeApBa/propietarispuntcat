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

  cif: string = '';
  userRole: string = '';
  isAdmin: boolean = false;
  documentsForm!: FormGroup;
  documentList: any[] = [];
  hide = false;
  hideResult = true;
  searchedDocument: any[] = [];
  documentsType: any[] = [];
  documents: any[] = [];
  documentType = 'Contractes';
  errorMessage: string = '';
  userStorage = localStorage.getItem('user') || '';
  @ViewChild('input') inputName: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private documentsService: DocumentsService
  ) { }

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif') || '';
    this.userRole = JSON.parse(this.userStorage).role;
    this.isAdmin = JSON.parse(this.userStorage).admin;
    this.documentsType = this.documentsService.documents;
    this.documentsForm = this.fb.group({
      name: new FormControl('')
    });
    this.getDocumentsList();

  }
// hide searched fields when escape key is pressed
escape(event: any): void {
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
  getDocuments(event: any): void {
    const input = (event.target as HTMLInputElement).value;
    this.errorMessage = '';
    this.documentType = input;

    this.documentsService.getDocumentsList(this.cif, input).subscribe(
      (resp: any) => {
        this.documents = resp.results;
      }
    );
  }

  // get the searched provider
  getDocument(document: any): void {
    this.errorMessage = '';
    if (document !== '' && document.length > 2) {
      this.hide = false;

      this.documentsService.getSearchedDocuments(this.cif, this.documentType, document).subscribe(
        (resp: any) => {
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
    getSelectedOption(result: any): void {
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
    downloadFile(document: any): void {

      this.documentsService.downloadFile(document.id).subscribe(
        (resp: any) => {
         const blob = new Blob([resp], {type: resp.type});
         const filename = document.filename.substring(document.filename.lastIndexOf('/') + 1, document.filename.length);

         saveAs(blob, filename);
        },
        (error: any) => {
          this.errorMessage = 'No s\'ha pogut trobar l\'arxiu';
        }
        );
    }

}
