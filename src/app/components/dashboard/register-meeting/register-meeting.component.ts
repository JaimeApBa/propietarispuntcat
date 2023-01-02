import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MeetingService } from 'src/app/services/meeting.service';

@Component({
  selector: 'app-register-meeting',
  templateUrl: './register-meeting.component.html',
  styleUrls: ['./register-meeting.component.css']
})
export class RegisterMeetingComponent implements OnInit {

  cif: string = '';
  meetingForm!: FormGroup;
  submitted = false;
  message: string = '';
  errorMessage: string = '';
  hide = false;
  availableTime = true;
  today: Date | undefined;
  isUpdate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private meetingService: MeetingService
  ) {}

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif') || '';
    this.isUpdate = false;
    this.today = new Date();

    // data form
    this.meetingForm = this.fb.group({
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      place: ['', Validators.required],
      community: ['', Validators.required]
    });

    this.getDataParams();
  }

  // getter for easy access to form fields
  get f(): any { return this.meetingForm.controls; }

  // change the type of the input in input type=data to use a placeholder in input type=dates
  changeTypeFocus(event: any): void {
    event.type = 'date';
  }
  changeTypeFocusTime(event: any): void {
    event.type = 'time';
  }
  changeTypeBlur(event: any): void {
    event.type = 'text';
  }

  // when update meeting, get the data from the params
  getDataParams(): void{
    const description = this.route.snapshot.paramMap.get('description');
    const date = new Date(this.route.snapshot.paramMap.get('date') || '');
    const place = this.route.snapshot.paramMap.get('place');

    if (description !== null && date !== null && place !== null) {
      this.meetingForm.controls['description'].setValue(description);
      this.meetingForm.controls['date'].setValue(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());

      if (date.getMinutes() < 10) {
        const minutes = '0' + date.getMinutes();
        this.meetingForm.controls['time'].setValue(date.getHours() + ':' + minutes);
      } else {
        this.meetingForm.controls['time'].setValue(date.getHours() + ':' + date.getMinutes());
      }

      this.meetingForm.controls['place'].setValue(place);
      this.isUpdate = true;
    }
  }

  // register on submit
  onSubmit(): void {
    this.submitted = true;

    this.meetingForm.controls['community'].setValue(this.cif);

    if (this.meetingForm.invalid) { return; }

    // set the correct date as datetime
    const date = this.meetingForm.value.date;
    const time = this.meetingForm.value.time;
    this.meetingForm.controls['date'].setValue(date + ' ' + time);
    this.meetingForm.removeControl('time');
    this.availableTime = this.meetingForm.contains('time'); // if time control doesn't exist, doesn't show control errors

    if (!this.isUpdate) {
      this.meetingService.registerMeeting(this.meetingForm.value).subscribe(
        (resp: any) => {this.message = resp; }
      );
    } else {
      const id = this.route.snapshot.paramMap.get('id') || '';

      this.meetingService.updateMeeting(this.meetingForm.value, id).subscribe(
        (resp: any) => {this.message = resp.message; }
      );
    }

    this.onReset();
  }


  onReset(): void {
    this.meetingForm.reset();
    Object.keys(this.meetingForm.controls).forEach(key => {
      this.meetingForm.get(key)!.setErrors(null) ;
    });
  }
}
