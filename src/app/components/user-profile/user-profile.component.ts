import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeCommunityService } from 'src/app/services/home-community.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  communityList: any;
  user: any;
  userProfile: any;
  message: string = '';
  errorMessage: string = '';
  userStorage = localStorage.getItem('user') || '';

  constructor(
    private router: Router,
    private homeCommunityService: HomeCommunityService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(this.userStorage).id;
    this.getUser();
    this.getCommunities();
  }

  // get data of the current user
  getUser(): void {
    this.userService.getUser(this.user).subscribe(
      ( resp: any) => {
        this.userProfile = resp;
      }
    );
  }



  // get the communities where user is subscribe
  getCommunities(): void {

    // reset the object
    this.communityList = [];
    this.homeCommunityService.getCommunities(this.user).subscribe(
      (resp: any) => {
        this.communityList = resp.results;
      },
      (error: any) => {
        this.errorMessage = error.error.message;
      }
    );
  }
  // update data of the provider
  editUser(user: any): void{
    this.router.navigate(['/registerUser', {id: user.id, name: user.name, fullname: user.fullname, phone: user.phone, email: user.email}]);
  }

}
