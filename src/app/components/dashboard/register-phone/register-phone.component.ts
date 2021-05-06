import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PhoneService } from 'src/app/services/phone.service';

@Component({
  selector: 'app-register-phone',
  templateUrl: './register-phone.component.html',
  styleUrls: ['./register-phone.component.css']
})
export class RegisterPhoneComponent implements OnInit {

  cif: string;
  phoneForm: FormGroup;
  hide = false;
  submitted = false;
  message: string;
  errorMessage: string;
  isUpdate: boolean;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private phoneService: PhoneService
  ) { }

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif');
    this.isUpdate = false;
    this.phoneForm = this.fb.group({
      name: ['', Validators.required],
      numberphone: ['', Validators.required]
    });
    this.getDataParams();
  }

  // getter for easy access to form fields
  get f(): any { return this.phoneForm.controls; }

  // when update phone, get the data from the params
  getDataParams(): void{
    const name = this.route.snapshot.paramMap.get('name');
    const numberphone = this.route.snapshot.paramMap.get('numberphone');

    if (name !== null && numberphone !== null) {
      this.phoneForm.controls.name.setValue(name);
      this.phoneForm.controls.numberphone.setValue(numberphone);
      this.isUpdate = true;
    }
  }

  // register on submit
  onSubmit(): void {
    this.submitted = true;
    if (this.phoneForm.invalid) { return; }

    if (!this.isUpdate) {
      this.phoneService.registerPhone(this.phoneForm.value, this.cif)
          .subscribe(
            resp => {
              this.errorMessage = '';
              this.message = resp;
            },
            error => {
              this.message = '';
              this.errorMessage = error.error.message;
            });
    } else {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.phoneService.updatePhone(id, this.phoneForm.value)
          .subscribe(
            resp => {
              this.errorMessage = '';
              this.message = resp.message;
            },
            error => {
              this.message = '';
              this.errorMessage = error.error.message;
            });
    }

    this.onReset();
  }

  onReset(): void {
    this.phoneForm.reset();
    Object.keys(this.phoneForm.controls).forEach(key => {
      this.phoneForm.get(key).setErrors(null) ;
    });
  }

}
