import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderService } from '../../../services/provider.service';
import { RefurbishmentService } from '../../../services/refurbishment.service';
import { saveAs } from 'file-saver';
import { DocumentsService } from 'src/app/services/documents.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {

  cifCommunity: string = '';
  cifProvider: string = '';
  provider: any;
  refurbishments: any;
  errorMessage: string = '';
  isAdmin: boolean = false;
  userRole: string = '';
  userStorage = localStorage.getItem('user') || '';


  constructor(
    private route: ActivatedRoute,
    private providerService: ProviderService,
    private refurbishmentService: RefurbishmentService,
    private documentsService: DocumentsService
  ) { }

  ngOnInit(): void {
    this.cifCommunity = this.route.snapshot.paramMap.get('cif') || '';
    this.cifProvider = this.route.snapshot.paramMap.get('provider') || '';
    this.userRole = JSON.parse(this.userStorage).role;
    this.isAdmin = JSON.parse(this.userStorage).admin;
    this.getDataProvider();
    this.getRefurbishments();
  }

  // Get the data of the current provider
  getDataProvider(): void {
    this.providerService.getProvidersList(this.cifCommunity).subscribe(
      (resp: any) => {
        this.provider = resp.results.filter((r: any) => r.cif === this.cifProvider)[0];
      }
    );
  }

  // get all works of the current provider
  getRefurbishments(): void{
    this.refurbishmentService.getRefurbishmentsList(this.cifCommunity).subscribe(
      (resp: any) => {
        this.refurbishments = resp.results.filter((r: any) => r.provider === this.cifProvider);
      }
    );
  }
  // download File
  downloadFile(document: any, id: any): void {

    this.documentsService.downloadFile(id).subscribe(
      (resp: any) => {
       const blob = new Blob([resp], {type: resp.type});
       const filename = document.substring(document.lastIndexOf('/') + 1, document.length);

       saveAs(blob, filename);
      },
      (error: any) => {
        console.log(error);
        this.errorMessage = 'No s\'ha pogut trobat l\'arxiu';
      }
      );
  }

}
