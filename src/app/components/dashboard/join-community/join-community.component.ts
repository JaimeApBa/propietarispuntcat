import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunityService } from 'src/app/services/community.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-join-community',
  templateUrl: './join-community.component.html',
  styleUrls: ['./join-community.component.css']
})
export class JoinCommunityComponent implements OnInit {

  joinComunityForm: FormGroup;
  submitted = false;
  message: string;
  hide = false;
  token: string;

  constructor(
    private fb: FormBuilder,
    private communityService: CommunityService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.joinComunityForm = this.fb.group({
      cif: [''],
      name: ['', Validators.required],
      floor: ['', Validators.required],
      door: ['', Validators.required],
      side: ['', Validators.required],
    });
  }

   // getter for easy access to form fields
   get f(): any { return this.joinComunityForm.controls; }

   // register on submit
   onSubmit(): any {
    this.submitted = true;
    if (this.joinComunityForm.invalid) { return; }
    this.joinComunityForm.controls.cif.setValue(this.route.snapshot.paramMap.get('cif'));
    this.communityService.joinCommunity(this.joinComunityForm.value)
                      .subscribe(resp => {this.message = resp; });

    this.onReset();
  }

  onReset(): void {
    this.joinComunityForm.reset();
    Object.keys(this.joinComunityForm.controls).forEach(key => {
      this.joinComunityForm.get(key).setErrors(null) ;
    });
  }

}
