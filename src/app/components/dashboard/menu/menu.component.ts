import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

   toggleNav(): void {
    const x = document.getElementById('burger');
    const y = document.getElementById('menu');

    if (y.style.display === 'block') {
        y.style.display = 'none';
    } else {
        y.style.display = 'block';
    }
    x.classList.toggle('change');
}

}
