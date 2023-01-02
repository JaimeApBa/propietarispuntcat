import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProviderService } from 'src/app/services/provider.service';
import { RefurbishmentService } from 'src/app/services/refurbishment.service';

@Component({
  selector: 'app-register-refurbishment',
  templateUrl: './register-refurbishment.component.html',
  styleUrls: ['./register-refurbishment.component.css']
})
export class RegisterRefurbishmentComponent implements OnInit {

  cif: string = '';
  refurbishmentForm!: FormGroup;
  workStates: any;
  workState: any;
  providers: any;
  provider: any;
  submitted = false;
  message: string = '';
  hide = false;
  @ViewChild('selectWorkState') selectWorkState: any;
  @ViewChild('selectProvider') selectProvider: any;
  isUpdate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private providerService: ProviderService,
    private refurbishmentService: RefurbishmentService
  ) {}

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif') || '';
    this.isUpdate = false;
    this.getWorkState();
    this.getProviders();

    // data form
    this.refurbishmentForm = this.fb.group({
      description: ['', Validators.required],
      provider: ['', Validators.required],
      workState: ['', Validators.required]
    });

    this.getDataParams();
  }

  // getter for easy access to form fields
  get f(): any { return this.refurbishmentForm.controls; }

  getWorkState(): void {
    this.refurbishmentService.getWorkState().subscribe(
      (res: any) => {
        this.workStates = res.results;
      }
    );
  }

  getProviders(): void {
    this.providerService.getProvidersList(this.cif).subscribe(
      (res: any) => {
        this.providers = res.results;
      }
    );
  }

  // when update refurbishment, get the data from the params
  getDataParams(): void{
    const description = this.route.snapshot.paramMap.get('description');
    const provider = this.route.snapshot.paramMap.get('provider');
    const workState = this.route.snapshot.paramMap.get('workState');

    if (description !== null && provider !== null && workState !== null) {
      this.refurbishmentForm.controls['description'].setValue(description);
      this.refurbishmentForm.controls['provider'].setValue(provider);
      this.refurbishmentForm.controls['workState'].setValue(workState);
      this.isUpdate = true;
    }
  }

  // register on submit
  onSubmit(): void {
    this.submitted = true;
    if (this.refurbishmentForm.invalid) { return; }
    // get the cif of the provider selected
    const provider = this.providers.filter( (r: any) => r.name === this.refurbishmentForm.value.provider).map((r: any) => r.cif);

    this.refurbishmentForm.controls['provider'].setValue(provider[0]);
    // get the id of the workstate selected
    const workState = this.workStates.filter( (r: any) => r.name === this.refurbishmentForm.value.workState).map((r: any) => r.id);
    this.refurbishmentForm.controls['workState'].setValue(workState[0]);

    if (!this.isUpdate) {
      this.refurbishmentService.registerRefurbishment(this.refurbishmentForm.value, this.cif).subscribe(
        (resp : any) => {
          this.message = resp;

          // the html select change to the selected option by default
          this.selectWorkState.nativeElement.options[0].selected = true;
          // the html select change to the selected option by default
          this.selectProvider.nativeElement.options[0].selected = true;
        }
      );
    } else {
      const id: any = this.route.snapshot.paramMap.get('id');

      this.refurbishmentService.updateRefurbishment(this.refurbishmentForm.value, id).subscribe(
        (resp : any) => {
          this.message = resp.message;

          // the html select change to the selected option by default
          this.selectWorkState.nativeElement.options[0].selected = true;
          // the html select change to the selected option by default
          this.selectProvider.nativeElement.options[0].selected = true;
        }
      );
    }


    this.onReset();
  }


  onReset(): void {
    this.refurbishmentForm.reset();
    Object.keys(this.refurbishmentForm.controls).forEach(key => {
      this.refurbishmentForm.get(key)!.setErrors(null) ;
    });
  }

}
