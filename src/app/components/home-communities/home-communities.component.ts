import { Component, OnInit } from '@angular/core';
import { HomeCommunityService } from '../../services/home-community.service';
import { Router } from '@angular/router';
import { AddressService } from 'src/app/services/address.service';

@Component({
  selector: 'app-home-communities',
  templateUrl: './home-communities.component.html',
  styleUrls: ['./home-communities.component.css']
})
export class HomeCommunityComponent implements OnInit {

  message: string;
  errorMessage: string;
  searchedAddresses: any;
  hide = false;
  user: any;
  communityList: any;
  pendingAccessList: any;
  requestAccessList: any;
  showList = false;
  list = false;

  constructor(
    private homeCommunityService: HomeCommunityService,
    private addressService: AddressService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')).id;
    this.removeRoleStorage();
    this.getCommunities();
    this.getPendingAccess();
    this.getRequestAccess();
  }


  removeRoleStorage(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    user.role = '';
    user.admin = '';
    localStorage.setItem('user', JSON.stringify(user));
  }
  // hide searched fields when press escape
  escape(event): void {
    if (event.keyCode === 27) {
      this.hide = true;
    }
  }

  // get searched addresses to join community
  getAddress(address): void {
    if (address !== '') {
      this.hide = false;
      this.addressService.getSearchAddress(address).subscribe(
        resp => {
          if (resp.message !== undefined) {
              this.hide = true;
          } else { this.searchedAddresses = resp.response; }
        },
        error => {
          this.errorMessage = error.error.message;
        });
    } else { this.hide = true; }
  }

  // get the communities where user is subscribe
  getCommunities(): void {

    // reset the object
    this.communityList = [];
    this.homeCommunityService.getCommunities(this.user).subscribe(
      resp => {
        this.communityList = resp.results;
      },
      error => {
        this.errorMessage = error.error.message;
      }
    );
  }

  // Get pending access requests communities if role allowed
  getRequestAccess(): void {
    this.showList = false;
    // reset the object
    this.requestAccessList = [];
    this.homeCommunityService.getRequestAccessCommunities(this.user).subscribe(
      resp => {
        if (resp.response !== undefined && resp.response.length > 0) {
          this.showList = true;
          this.requestAccessList = resp.response;
          console.log(this.requestAccessList);
        } else { this.showList = false; }
      },
      error => {
        this.errorMessage = error.error.message;
      }
    );
  }

  // get the communities where user is pending to access
  getPendingAccess(): void {
    this.list = false;
    // reset the object
    this.pendingAccessList = [];

    this.homeCommunityService.getPendingAccessCommunities(this.user).subscribe(
      resp => {
        if (resp.results !== undefined && resp.results.length > 0) {
          this.list = true;
          this.pendingAccessList = resp.results;
        } else { this.list = false; }
      },
      error => {
        this.errorMessage = error.error.message;
      }
    );
  }
  // refusing user request of access to the community
  refuseRequestUser(userRequest): void {
    const belongsTo = 'refused';
    this.homeCommunityService.manageRequestUserCommunity(userRequest, belongsTo).subscribe(
      resp => {
        this.getRequestAccess();
      },
      error => {
        this.errorMessage = error.error.message;
      }
      );
  }
  // accepting user request of access to the community
  acceptRequestUser(userRequest): void {
    const belongsTo = 'accepted';
    this.homeCommunityService.manageRequestUserCommunity(userRequest, belongsTo).subscribe(
      resp => {
        this.getRequestAccess();
      },
      error => {
        this.errorMessage = error.error.message;
      }
      );
  }

  // Join the community when selected in the search bar

  joinCommunity(community): void {
    this.router.navigate(['joinCommunity', community.cif]);
  }

  isAdmin(request): void {
    console.log(request);
  }

}
