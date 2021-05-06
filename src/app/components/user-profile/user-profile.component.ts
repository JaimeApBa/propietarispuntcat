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
  message: string;
  errorMessage: string;

  constructor(
    private router: Router,
    private homeCommunityService: HomeCommunityService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')).id;
    this.getUser();
    this.getCommunities();
  }

  // get data of the current user
  getUser(): void {
    this.userService.getUser(this.user).subscribe(
      resp => {
        this.userProfile = resp;
      }
    );
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
  // update data of the provider
  editUser(user): void{
    this.router.navigate(['/registerUser', {id: user.id, name: user.name, fullname: user.fullname, phone: user.phone, email: user.email}]);
  }

}
