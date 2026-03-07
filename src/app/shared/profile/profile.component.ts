import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userName = 'John Doe';
  userRole = 'CLIENTE';
  isLoggedIn = false;

  constructor() { 
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    this.isLoggedIn = !!token;
    if (role) {
      this.userRole = role;
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    this.isLoggedIn = false;
    window.location.href = '/login';
  }
}
