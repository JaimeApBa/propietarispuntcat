import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommunityService } from '../../../services/community.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {

  message: string;
  searchedAddresses: any;
  hide = false;
  user: any;
  communityList: any;
  @Output() selectedCommunity = new EventEmitter();

  constructor(
    private communityService: CommunityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCommunities();
  }

  // get searched addresses to join community
  getAddress(address): any {
    if (address !== '') {
      this.communityService.getSearchAddress(address).subscribe(
        resp => {

          if (resp.message !== undefined) {
              this.hide = true;
            } else {
              this.searchedAddresses = resp.response;
            }

          });
        } else {
          this.hide = true;
        }
  }

  // get the communities where user is subscribe
  getCommunities(): any {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.communityService.getCommunities(this.user.id).subscribe(
      resp => {
        this.communityList = resp.results;
        console.log(this.communityList);
      }
    );
  }

  // Join the community when selected in the search bar

  joinCommunity(community): any {
    this.router.navigate(['joinCommunity', community.cif]);
  }
}
