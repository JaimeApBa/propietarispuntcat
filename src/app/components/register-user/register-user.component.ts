import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ValidatePassword } from 'src/app/helpers/matchPassword.validator';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  userForm: FormGroup;
  submitted = false;
  message: string;
  errorMessage: string;
  isUpdateUser: boolean;
  isUpdatePassword: boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.isUpdateUser = false;
    this.isUpdatePassword = false;

    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: [null, [Validators.pattern('[0-9]{9}')]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: ValidatePassword.MatchPassword // custom validation
    });

    this.getDataParams();

}
  // getter for easy access to form fields
  get f(): any { return this.userForm.controls; }

  // when update a provider, get the data from the params
  getDataParams(): void{

    const name = this.route.snapshot.paramMap.get('name');
    const fullname = this.route.snapshot.paramMap.get('fullname');
    const email = this.route.snapshot.paramMap.get('email');
    const phone = this.route.snapshot.paramMap.get('phone');
    const password = this.route.snapshot.paramMap.get('password');

    if (name !== null && fullname !== null && email !== null) {
      this.userForm.controls.name.setValue(name);
      this.userForm.controls.fullname.setValue(fullname);
      this.userForm.controls.email.setValue(email);
      if (phone !== 'null' && phone !== null) {
        this.userForm.controls.phone.setValue(phone);
      } else {
        this.userForm.controls.phone.setValue('');
      }

      this.isUpdateUser = true;
    }

    if (password !== null && password) {
      this.isUpdatePassword = true;
      this.isUpdateUser = false;
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.isUpdateUser) {
      this.userForm.removeControl('password');
      this.userForm.removeControl('confirmPassword');
    }
    if (this.isUpdatePassword) {
      this.userForm.removeControl('name');
      this.userForm.removeControl('fullname');
      this.userForm.removeControl('phone');
    }

    if (this.userForm.invalid) { return; }

    if (this.isUpdateUser) {
      const id = this.route.snapshot.paramMap.get('id');
      this.userService.updateUser(this.userForm.value, id).subscribe(
          resp => {this.message = resp; },
          err => {this.errorMessage = err.message; }
      );
    } else if (this.isUpdatePassword){
      this.userService.updatePasswordUser(this.userForm.value).subscribe(
          resp => {
            this.errorMessage = '';
            this.message = resp;
          },
          err => {
            this.message = '';
            this.errorMessage = err.error.message;
          }
      );
    } else {
      this.userService.signUp(this.userForm.value).subscribe(
          resp => {
            this.errorMessage = '';
            this.message = resp;
          },
          err => {
            this.message = '';
            this.errorMessage = err.error.message;
          }
      );
    }

    this.onReset();
  }

  onReset(): void {
    this.userForm.reset();
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key).setErrors(null) ;
  });
  }
}
