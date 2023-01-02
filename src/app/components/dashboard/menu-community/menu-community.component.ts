import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-menu-community',
  templateUrl: './menu-community.component.html',
  styleUrls: ['./menu-community.component.css']
})
export class MenuCommunityComponent implements OnInit {

  cif: string = '';
  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.cif = this.route.snapshot.paramMap.get('cif') || '';
  }
  toggleNav(): void {
    const x = document.getElementById('burger');
    const y = document.getElementById('menu');
    const z = document.getElementById('main');

    if (y!.style.display === 'block') {
        y!.style.display = 'none';
        z!.style.display = 'block';
    } else {
        y!.style.display = 'block';
        z!.style.display = 'none';
    }
    x!.classList.toggle('change');
}
 // logout
 logout(): void {
  this.userService.logout();
}
}
