import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProfessionService } from 'src/app/services/profession.service';

@Component({
  selector: 'app-register-profession',
  templateUrl: './register-profession.component.html',
  styleUrls: ['./register-profession.component.css']
})
export class RegisterProfessionComponent implements OnInit {

  cif: string;
  professionForm: FormGroup;
  hide = false;
  submitted = false;
  message: string;
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private professionService: ProfessionService
  ) { }

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif');
    this.professionForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  // getter for easy access to form fields
  get f(): any { return this.professionForm.controls; }

    // register on submit
    onSubmit(): void {
      this.submitted = true;
      if (this.professionForm.invalid) { return; }

      this.professionService.registerProfession(this.professionForm.value)
          .subscribe(
            resp => {
              this.errorMessage = '';
              this.message = resp;
            },
            error => {
              this.message = '';
              this.errorMessage = error.error.message;
            });
      this.onReset();
    }

    onReset(): void {
      this.professionForm.reset();
      Object.keys(this.professionForm.controls).forEach(key => {
        this.professionForm.get(key).setErrors(null) ;
      });
    }
}
