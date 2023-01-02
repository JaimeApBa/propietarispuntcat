import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeCommunityService } from 'src/app/services/home-community.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-join-community',
  templateUrl: './join-community.component.html',
  styleUrls: ['./join-community.component.css']
})
export class JoinCommunityComponent implements OnInit {

  joinComunityForm!: FormGroup;
  submitted = false;
  message: string = '';
  errorMessage: string = '';
  hide = false;
  token: string = '';
  isEstateAdministrator: boolean = false;
  userStorage = localStorage.getItem('user') || '';

  constructor(
    private fb: FormBuilder,
    private homeCommunityService: HomeCommunityService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isEstateAdministrator = false;
    this.joinComunityForm = this.fb.group({
      cif: [''],
      name: ['', Validators.required],
      floor: ['', Validators.required],
      door: ['', Validators.required],
      side: ['', Validators.required],
      estateAdministrator: ['']
    });
  }

  // if user is state administrtor
  isAdmin(): void {
    this.isEstateAdministrator = !this.isEstateAdministrator;
  }

   // getter for easy access to form fields
   get f(): any { return this.joinComunityForm.controls; }

   // register on submit
   onSubmit(): any {
    this.submitted = true;
    this.errorMessage = '';
    this.message = '';
    const userId = JSON.parse(this.userStorage).id;

    if (this.isEstateAdministrator) {
      this.joinComunityForm.controls['estateAdministrator'].setValue(1);
      this.joinComunityForm.controls['floor'].setValue('');
      this.joinComunityForm.controls['door'].setValue('');
      this.joinComunityForm.controls['side'].setValue('');
      this.joinComunityForm.get('floor')!.clearValidators();
      this.joinComunityForm.get('door')!.clearValidators();
      this.joinComunityForm.get('side')!.clearValidators();
      this.joinComunityForm.get('floor')!.updateValueAndValidity();
      this.joinComunityForm.get('door')!.updateValueAndValidity();
      this.joinComunityForm.get('side')!.updateValueAndValidity();
    } else{
      this.joinComunityForm.controls['estateAdministrator'].setValue(0);
    }

    if (this.joinComunityForm.invalid) { return; }
    this.joinComunityForm.controls['cif'].setValue(this.route.snapshot.paramMap.get('cif'));
    this.homeCommunityService.joinCommunity(this.joinComunityForm.value, userId)
                      .subscribe(
                        (resp: any) => {
                          this.message = resp.message;
                        },
                        (err: any) => {
                          this.errorMessage = err.error.message;
                      });

    this.onReset();
  }

  onReset(): void {
    this.joinComunityForm.reset();
    Object.keys(this.joinComunityForm.controls).forEach(key => {
      this.joinComunityForm.get(key)!.setErrors(null) ;
    });
  }

}
