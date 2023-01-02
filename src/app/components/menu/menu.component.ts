import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {

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
