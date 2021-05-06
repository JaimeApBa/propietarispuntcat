import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MeetingService } from 'src/app/services/meeting.service';
import { ProviderService } from 'src/app/services/provider.service';
import { RefurbishmentService } from 'src/app/services/refurbishment.service';
import { DocumentsService } from '../../../services/documents.service';

@Component({
  selector: 'app-register-document',
  templateUrl: './register-document.component.html',
  styleUrls: ['./register-document.component.css']
})
export class RegisterDocumentComponent implements OnInit {

  cif: string;
  documentsForm: FormGroup;
  submitted = false;
  message: string;
  errorMessage: string;
  hide = false;
  documentsType = [];
  searchedProvider: any;
  labelFile: string;
  file: File;
  currentProvider: any;
  docType: string;
  refurbishments: any;
  boardMinutes: any;
  meetings: any;
  @ViewChild('documentSelect') documentSelect;
  @ViewChild('inputRefurbishment') inputRefurbishment;
  @ViewChild('selectBoardMinute') selectBoardMinute;
  @ViewChild('selectMeeting') selectMeeting;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private documentsService: DocumentsService,
    private providerService: ProviderService,
    private refurbishmentService: RefurbishmentService,
    private meetingService: MeetingService
  ) { }

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif');
    this.documentsType = this.documentsService.documents;
    this.boardMinutes = [];
    this.getRefurbishments();

    // data form of the document
    this.documentsForm = this.fb.group({
      description: ['', Validators.required],
      comments: [''],
      filename: [null],
      documentType: ['', Validators.required]
    });

  }

  // depending the option of the document type, add fields to the form
  initForm(type): void {
    this.message = '';
    this.errorMessage = '';
    this.labelFile = '';
    this.submitted = false;
    Object.keys(this.documentsForm.controls).forEach(key => {
      this.documentsForm.get(key).setErrors(null) ;
    });

    let data;
    switch (type) {
      case 'Contractes':
        data = ['numContract', 'initDate', 'endDate', 'provider'];
        this.addControlForm(data);
        break;
      case 'Pressupostos':
        data = ['numBudget', 'dateBudget', 'refurbishment', 'provider'];
        this.addControlForm(data);
        break;
      case 'Factures':
        data = ['numInvoice', 'dateInvoice', 'refurbishment', 'provider'];
        this.addControlForm(data);
        break;
      case 'Actes':
        data = ['dateMinute', 'meeting'];
        this.addControlForm(data);
        this.getMeetings();
        break;
      case 'Resums Econòmics':
        data = ['dateSummary'];
        this.addControlForm(data);
        break;
      case 'Comunicats':
        data = ['dateStatement', 'user', 'boardMinute'];
        this.addControlForm(data);
        this.documentsForm.controls.user.setValue(JSON.parse(localStorage.getItem('user')).id);
        break;
      case 'Altres documents':
        data = ['dateDocs'];
        this.addControlForm(data);
        break;

    }
  }

  // add control to the formgroup
  addControlForm(data): void {
    data.forEach(element => {
      if (element !== 'boardMinute') {
        this.documentsForm.addControl(element, this.fb.control('', Validators.required));
      } else {
        this.documentsForm.addControl(element, this.fb.control(''));
      }
    });
  }

  // getter for easy access to form fields
  get f(): any { return this.documentsForm.controls; }


  // change the type of the input in input type=data to use a placeholder in input dates
  changeTypeFocus(event): void {
    event.type = 'date';
  }
  setMinAttibute(event): void {
    event.setAttribute('min', this.documentsForm.get('initDate').value);
  }
  changeTypeBlur(event): void {
    event.type = 'text';
  }

  // get the provider given in the input
  getProvider(provider): void {
    if (provider !== '') {
      this.hide = false;
      this.providerService.getSearchedProviders(this.cif, provider).subscribe(
        resp => {
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

// When select a match provider result, fill the field of the form
  getSearchedProvider(provider): any {
    this.documentsForm.controls.provider.setValue(provider.name);
    this.hide = true;
    this.currentProvider = provider.cif;
  }

  // show the filename uplodaded
  feedbackButton(file): void {
    this.labelFile = file[0].name;
    this.file = file[0];
    this.documentsForm.patchValue({
      filename: this.file
    });
  }

  // get a list of your refurbishments by community
  getRefurbishments(): void {
    this.refurbishmentService.getRefurbishmentsList(this.cif).subscribe(
      resp => {
        this.refurbishments = resp.results;
      }
      );
  }

  // get a list of your refurbishments by community
  getMeetings(): void {
    this.meetingService.getMeetingList(this.cif).subscribe(
      resp => {
        this.meetings = resp.results;
      }
      );
  }
  // For boardMinute documents: get meeting selected
  getMeeting(input): void {
    const date = input.substring(0, input.indexOf(' '));
    const value = this.meetings.filter(r => formatDate(r.date, 'dd-MM-yyyy', 'ca') === date)[0];

    this.documentsForm.controls.meeting.setValue(value.id);
    this.documentsForm.controls.description.setValue(value.description);
    this.documentsForm.controls.dateMinute.setValue(formatDate(value.date, 'yyyy-MM-dd', 'ca'));
  }

  // add the refurbishment data to the form when it's nececessary
  addDataRefurbishment(input): void {
      // get the data field of the refurbishment selected
      const data = this.refurbishments.filter(r => r.description === input)[0];
      //  set the values in the form
      this.documentsForm.controls.description.setValue(data.description);
      this.documentsForm.controls.provider.setValue(data.providerName);
      this.documentsForm.controls.refurbishment.setValue(data.id);
      this.inputRefurbishment.nativeElement.options[0].selected = true; // the html select, change to the selected option by default
      this.currentProvider = data.provider;

  }

  // For stament documents: get boardMinute selected
  getBoardMinute(input): void {
    console.log(input);
    if (input !== 'Cap') {
      this.documentsForm.controls.boardMinute.setValue(input);
    } else {
      this.documentsForm.controls.boardMinute.setValue('');
    }
    this.selectBoardMinute.nativeElement.options[0].selected = true; // the html select, change to the selected option by default
  }

  // register on submit
  onSubmit(): void {
    this.submitted = true;

    if (this.documentsForm.invalid) { return; }

    // if the form has a provider, get his cif
    if (this.documentsForm.controls.provider !== undefined) {
      this.documentsForm.controls.provider.setValue(this.currentProvider);
    }

    // preparing for uploading the file
    const uploadFile = new FormData();
    const formValue = this.documentsForm.value;
    if (this.file) {
      Object.keys(formValue).forEach(key => {
        uploadFile.append(key, this.documentsForm.get(key).value);
      });
    }

    this.documentsService.registerDocument(uploadFile, this.cif).subscribe(
      resp => {
        this.errorMessage = '';
        this.message = resp;
        Object.keys(formValue).forEach(key => {
          uploadFile.delete(key);
        });
        this.onReset();
        // the html select change to the selected option by default
        this.documentSelect.nativeElement.options[0].selected = true;
      },
      error => {
        this.message = '';
        this.errorMessage = error.error.message;
      });

  }

  onReset(): void {
    this.documentsForm.reset();
    this.labelFile = '';
    this.submitted = false;

    Object.keys(this.documentsForm.controls).forEach(element => {
      if (element !== 'description' && element !== 'comments' && element !== 'filename' && element !== 'documentType') {
        this.documentsForm.removeControl(element);
      }

    });
    Object.keys(this.documentsForm.controls).forEach(key => {
      this.documentsForm.get(key).setErrors(null) ;
    });
  }

}
