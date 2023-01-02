import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentsService } from 'src/app/services/documents.service';
import { RefurbishmentService } from '../../../services/refurbishment.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-refurbishment',
  templateUrl: './refurbishment.component.html',
  styleUrls: ['./refurbishment.component.css']
})
export class RefurbishmentComponent implements OnInit {

  cif: string = '';
  workStateForm!: FormGroup;
  refurbishments: any;
  refurbishmentList: any;
  hide = false;
  hideResult = true;
  searchedRefurbishment: any[] = [];
  workStates: any;
  errorMessage: string = '';
  @ViewChild('workState') workStateInput: any;
  userRole: string = '';
  isAdmin: boolean = false;
  userStorage = localStorage.getItem('user') || '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private refurbishmentService: RefurbishmentService,
    private documentsService: DocumentsService
  ) { }

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif') || '';
    this.userRole = JSON.parse(this.userStorage).role;
    this.isAdmin = JSON.parse(this.userStorage).admin;
    this.getWorkState();
    this.getRefurbishments();
    this.workStateForm = this.fb.group({
      workState: new FormControl('')
    });
  }

  // hide searched fields when escape key is pressed
  escape(event: any): void {
    if (event.keyCode === 27) {
      this.hide = true;
    }
  }

  // get a list of your refurbishments by community
  getRefurbishments(): void {
    this.refurbishmentService.getRefurbishmentsList(this.cif).subscribe(
      (resp: any) => {
        if (!this.workStateForm.value.workState || this.workStateForm.value.workState === 'Estat de la reforma'
            || this.workStateForm.value.workState === 'Tots') {
          this.refurbishmentList = resp.results;
          this.workStateInput.nativeElement.options[0].selected = true; // the html select change to the selected option by default
        }

        else {
          this.refurbishmentList = resp.results.filter((r: any) => r.workState === this.workStateForm.value.workState);
        }
      },
      (error: any) => {
        this.errorMessage = error.error.message;
      }
    );
  }

  // get the searched refurbishment
  getRefurbishment(refurbishment: any): void {
    if (refurbishment !== '') {
      this.hide = false;
      this.refurbishmentService.getSearchedRefurbishments(this.cif, refurbishment).subscribe(
        (resp: any) => {
          if (resp.message !== undefined) {
              this.hide = true;
            } else {
              this.searchedRefurbishment = resp.results;
              console.log(this.searchedRefurbishment);
            }
          });
        } else {
          this.hide = true;
        }
  }


  // when click a searched result in the search bar, show that result
  getSelectedOption(result: any): void {
    this.refurbishmentList = [result];
    this.hide = true;
    this.hideResult = false;
  }

  // when show the result of the search bar, hide/show text to view all results again
  changeHideResult(): void {
    this.getRefurbishments();
    this.hideResult = true;
  }

  // get a list of work states
  getWorkState(): void {
    this.refurbishmentService.getWorkState().subscribe(
      (resp: any) => {
        this.workStates = resp.results;
      }
    );
  }

  // download File
  downloadFile(document: any, id: number): void {
    this.documentsService.downloadFile(id).subscribe(
      (resp: any) => {
       const blob = new Blob([resp], {type: resp.type});
       const filename = document.substring(document.lastIndexOf('/') + 1, document.length);

       saveAs(blob, filename);
      },
      (error: any) => {
        this.errorMessage = 'No s\'ha pogut trobat l\'arxiu';
      }
      );
  }

  removeRefurbishment(refurbishment: any): void {
    this.refurbishmentService.removeRefurbishment(this.cif, refurbishment.id).subscribe(
      (resp: any) => this.getRefurbishments()
    );
  }

  editRefurbishment(refurbishment: any): void {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['/registerRefurbishment', this.cif, {id: refurbishment.id, description: refurbishment.description, provider: refurbishment.providerName, workState: refurbishment.workState}]);
  }


}
