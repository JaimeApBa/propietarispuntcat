import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentsService } from 'src/app/services/documents.service';
import { MeetingService } from 'src/app/services/meeting.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit {

  cif: string;
  meetingList: any;
  meetingPastList: any;
  meetingFuturList: any;
  searchedMeeting: any;
  hide = false;
  hideResult = false;
  errorMessage: string;
  @ViewChild('input') inputName;
  userRole: string;
  isAdmin: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
    private documentsService: DocumentsService
  ) { }

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif');
    this.userRole = JSON.parse(localStorage.getItem('user')).role;
    this.isAdmin = JSON.parse(localStorage.getItem('user')).admin;
    this.getMeetings();

  }

  // hide searched fields when escape key is pressed
  escape(event): void {
    if (event.keyCode === 27) {
      this.hide = true;
    }
  }

  // get a list of your meetings by community
  getMeetings(): void {
    const today = new Date().toISOString();

    this.meetingService.getMeetingList(this.cif).subscribe(
      (resp: any) => {
        this.meetingList = resp.results;
        this.meetingFuturList = resp.results.filter(r => r.date > today);
        this.meetingPastList = resp.results.filter(r => r.date < today);
      },
      error => {
        this.errorMessage = error.error.message;
      }
    );
  }
  // get the searched meeting
  getMeeting(meeting): void {
    if (meeting !== '' && meeting.length > 2) {
      this.hide = false;
      this.meetingService.getSearchedMeeting(this.cif, meeting).subscribe(
        resp => {
          if (resp.message !== undefined) {
              this.hide = true;
            } else {
              this.searchedMeeting = resp.results;
            }
      });
    } else {
        this.hide = true;
    }
  }

  // when click a searched result in the search bar, show that result
  getSelectedOption(result): void {
    this.meetingList = [result];
    this.hide = true;
    this.hideResult = true;
    this.inputName.nativeElement.value = ''; // clear the search bar
  }
  // when show the result of the search bar, hide/show text to view all results again
  changeHideResult(): void {
    this.hideResult = false;
  }

  // download File
  downloadFile(document, id): void {
    this.documentsService.downloadFile(id).subscribe(
      resp => {
       const blob = new Blob([resp], {type: resp.type});
       const filename = document.substring(document.lastIndexOf('/') + 1, document.length);

       saveAs(blob, filename);
      },
      error => {
        this.errorMessage = 'No s\'ha pogut trobat l\'arxiu';
      }
      );
  }
  removeMeeting(meeting): void {
    this.meetingService.removeMeeting(this.cif, meeting.id).subscribe(
      resp => this.getMeetings()
    );
  }
  editMeeting(meeting): void {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['/registerMeeting', this.cif, meeting]);
  }

}
