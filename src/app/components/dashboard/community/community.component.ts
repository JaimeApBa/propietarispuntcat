import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeCommunityService } from '../../../services/home-community.service';
import { CommunityService } from '../../../services/community.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {

  community: any;
  cif: string = '';
  user: number = NaN;
  userCommunityList: any[] = [];
  users: any[] = [];
  presidentCommunity: any;
  secretaryCommunity: any;
  userRole: string = '';
  isAdmin: boolean= false;
  presidentForm!: FormGroup;
  secretaryForm!: FormGroup;
  adminForm!: FormGroup;
  adminCommunity: any[] = [];
  admins: any[] = [];
  admin: any;
  userStorage= localStorage.getItem('user') || '';
  @ViewChild('admin') adminOption: any;
  @ViewChild('selectedPresident') selectedPresident: any;
  @ViewChild('selectedSecretary') selectedSecretary: any;

  constructor(
    private route: ActivatedRoute,
    private homeCommunityService: HomeCommunityService,
    private communityService: CommunityService,
    private providerService: ProviderService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif') || '';

    this.getDataCommunity();
    this.getDataUsersCommunity();
    this.getAdmin();

    this.presidentForm = this.fb.group({
      userRole: new FormControl('')
    });
    this.secretaryForm = this.fb.group({
      userRole: new FormControl('')
    });
    this.adminForm = this.fb.group({
      userRole: new FormControl('')
    });
  }

  // get the data of the current community
  getDataCommunity(): any {
    this.user = JSON.parse(this.userStorage).id;
    this.homeCommunityService.getCommunities(this.user).subscribe(
      (resp: any) => {
        resp.results.forEach((result: any) => {
          if (result.cif === this.cif) { this.community = result; }
          else { return; }
        });
      }
    );
  }


  // get all users that belongs to the current community
  getDataUsersCommunity(): void {
    this.communityService.getUsersCommunity(this.cif).subscribe(
      (resp: any) => {
        this.userCommunityList = resp.filter((r: any) => !r.estateAdministrator);
        this.users = resp.filter((r: any) => !r.estateAdministrator);

        // initialize those objects every time the user make a change
        this.presidentCommunity = [];
        this.secretaryCommunity = [];

        this.userRole = JSON.parse(this.userStorage).role;
        this.isAdmin = JSON.parse(this.userStorage).admin;

        // get the president if exists
        this.users.forEach(result => {
          if (result.role === 'President') {
            this.presidentCommunity = result;
            this.users = this.userCommunityList.filter(r => r !== result);
          }
        });

        // get the secretary if exists
        this.users.forEach(result => {
          if (result.role === 'Secretari') {
            this.secretaryCommunity = result;
            this.users = this.users.filter(r => r !== result);
          }
        });
      }
    );
  }

  // get the estate administrator

  getAdmin(): void {
    // initialize the object every time the user make a change
    this.admin = [];

    this.providerService.getProvidersList(this.cif).subscribe(
      (resp: any) => {
        // list of estate administrators
        this.adminCommunity = resp.results.filter((r: any) => r.profession === 'Administrador de Finques');
        this.admin = resp.results.filter((r: any) => r.profession === 'Administrador de Finques' && r.role === 1)[0];

        if (this.admin === undefined) {
          this.admin = [];
        }
      }
    );
  }

  onSubmit(role: any): void {

    if (role === 'President') {
      this.saveUserRole(this.presidentForm.value, role);
    }
    if (role === 'Secretari') {
      this.saveUserRole(this.secretaryForm.value, role);
    }
    if (role === 'Administrador de Finques') {
      this.saveAdminRole(this.adminForm.value, role);
    }


  }

  saveUserRole(form: any, role: any): void {
    // if none selected, set users to Propietari
    if (form.userRole === 'Ningú') {
      this.userCommunityList.forEach(element => {
        if (element.role === role) {
          role = {role: 'Propietari'};
          this.communityService.changeRoleUserCommunity(element.id, this.cif, role).subscribe(
            (response: any) => {
              this.getDataUsersCommunity();
              this.selectedPresident.nativeElement.options[0].selected = true; // the html select change to the selected option by default
              this.selectedSecretary.nativeElement.options[0].selected = true; // the html select change to the selected option by default
            }
          );
        }
      });

    } else {

      if (form.userRole !== '') { role = {role}; }

      const index = form.userRole.indexOf(' |');
      const userName = form.userRole.substring(0, index);
      // find the id of the selected user
      this.userCommunityList.forEach(element => {
          const user = element.name + ' ' + element.fullname;
          if (user === userName) {
            this.communityService.changeRoleUserCommunity(element.id, this.cif, role).subscribe(
              (response: any) => {
                this.getDataUsersCommunity();
                this.selectedPresident.nativeElement.options[0].selected = true; // the html select change to the selected option by default
                this.selectedSecretary.nativeElement.options[0].selected = true; // the html select change to the selected option by default
              }
              );
          }
      });

    }
  }

  saveAdminRole(form: any, role: any): void {

    if (form.userRole === 'Ningú') {
      this.adminOption.nativeElement.options[0].selected = true;
      this.adminCommunity.forEach(element => {
        if (element.role === 1) {
          role = {role: 4};
          this.providerService.changeRoleProviderCommunity(element.cif, this.cif, role).subscribe(
            (response: any) => {
              this.getAdmin();
            });
        }
      });

    } else {

      if (form.userRole !== '') { role = {role: 1}; }
        // find the id of the selected provider
      this.adminCommunity.forEach(element => {
        if (element.name === form.userRole) {
            this.providerService.changeRoleProviderCommunity(element.cif, this.cif, role).subscribe(
              (response: any) => {
                this.getAdmin();
            }
            );
        }
      });
    }
  }

  // remove user from the community
  removeUserCommunity(user: any): void {
    this.communityService.removeUserCommunity(user.id, this.cif).subscribe(
      (resp: any) => {
        this.getDataUsersCommunity();
      }
    );
  }

}
