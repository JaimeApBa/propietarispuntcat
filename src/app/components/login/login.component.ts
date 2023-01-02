import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage: string= '';

  profileForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    public userService: UserService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.errorMessage = '';
  }

  onSubmit(): any {

    if (this.profileForm.invalid) { return; }

    this.userService.login(this.profileForm.value)
                    .subscribe( (resp: any) => {
                      this.router.navigate(['/home']);
                    },
                      ( error: string) => {
                        // console.log('err: ' + error);
                        this.errorMessage = error;
                      });
  }

}
