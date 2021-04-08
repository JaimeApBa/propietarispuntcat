import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ValidatePassword } from 'src/app/helpers/matchPassword.validator';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  userForm: FormGroup;
  submitted = false;
  message: string;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('[0-9]{9}')]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: ValidatePassword.MatchPassword // custom validation
    });

}
  // getter for easy access to form fields
  get f(): any { return this.userForm.controls; }

  onSubmit(): any {
    this.submitted = true;
    if (this.userForm.invalid) { return; }
    console.log(this.userForm.value);
    this.userService.signUp(this.userForm.value)
                      .subscribe(resp => {this.message = resp; });

    this.onReset();
  }

  onReset(): void {
    this.userForm.reset();
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key).setErrors(null) ;
  });
  }
}
