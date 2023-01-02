import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DocumentsService } from 'src/app/services/documents.service';
import { AdvertisementService } from '../../../services/advertisement.service';

@Component({
  selector: 'app-register-advertisement',
  templateUrl: './register-advertisement.component.html',
  styleUrls: ['./register-advertisement.component.css']
})
export class RegisterAdvertisementComponent implements OnInit {
  cif: string = '';
  advertisementForm!: FormGroup;
  statements: any;
  submitted = false;
  message: string = '';
  errorMessage: string = '';
  hide = false;
  isUpdate: boolean = false;
  userStorage: string = localStorage.getItem('user') || '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private documentsService: DocumentsService,
    private advertisementService: AdvertisementService
  ) { }

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif') || '';
    this.errorMessage = '';
    this.message = '';
    this.isUpdate = false;

    // data form
    this.advertisementForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      user: [''],
      community: [''],
      statement: [null]
    });

    this.getDataParams();
  }

  // getter for easy access to form fields
  get f(): any { return this.advertisementForm.controls; }

  // change the type of the input in input type=data to use a placeholder in input dates
  changeTypeFocus(event: any): void {
    event.type = 'date';
  }
  changeTypeBlur(event: any): void {
    event.type = 'text';
  }

  // when update a provider, get the data from the params
  getDataParams(): void{
    const name = this.route.snapshot.paramMap.get('name');
    const description = this.route.snapshot.paramMap.get('description');
    const date = new Date(this.route.snapshot.paramMap.get('date') || '');

    if (name !== null && description !== null && date !== null) {
      this.advertisementForm.controls['name'].setValue(name);
      this.advertisementForm.controls['description'].setValue(description);
      this.advertisementForm.controls['date'].setValue(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());

      this.isUpdate = true;
    }
  }

  // register on submit
  onSubmit(): void {
    this.submitted = true;
    if (this.advertisementForm.invalid) { return; }

    // set the user
    const user = JSON.parse(this.userStorage).id;
    this.advertisementForm.controls['user'].setValue(user);

    // set the community
    // set the community
    this.advertisementForm.controls['community'].setValue(this.cif);
    if (!this.isUpdate) {
      this.advertisementService.registerAdvertisement(this.advertisementForm.value).subscribe(
        (resp: any) => {
          this.errorMessage = '';
          this.message = resp;

        },
        (error: any) => {
          this.message = '';
          this.errorMessage = error.error.message;
        }
      );
    } else {
      const id = this.route.snapshot.paramMap.get('id') || '';
      this.advertisementService.updateAdvertisement(this.advertisementForm.value, id).subscribe(
        (resp: any) => {
          this.errorMessage = '';
          this.message = resp.message;

        },
        (error: any) => {
          this.message = '';
          this.errorMessage = error.error.message;
        });
    }
    this.onReset();
  }


  onReset(): void {
    this.advertisementForm.reset();
    Object.keys(this.advertisementForm.controls).forEach(key => {
      this.advertisementForm.get(key)!.setErrors(null) ;
    });
  }

}
