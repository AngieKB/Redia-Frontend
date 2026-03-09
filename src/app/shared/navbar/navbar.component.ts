import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ProfileComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  dashboardLink = '/home';

  constructor() { }

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.isLoggedIn = true;
      const role = localStorage.getItem('role');
      if (role === 'ADMINISTRADOR') {
        this.dashboardLink = '/admin/dashboard';
      } else if (role === 'RECEPCIONISTA') {
        this.dashboardLink = '/recepcionista/dashboard';
      } else {
        this.dashboardLink = '/cliente/my-reservations';
      }
    }
  }

}
