import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userName = '';
  userRole = '';
  userPhoto = '';
  isLoggedIn = false;
  isDropdownOpen = false;

  constructor() { }

  ngOnInit() {
    this.checkAuthStatus();
    // Re-check periodically since navigation doesn't always trigger a component reload in Angular SPAs.
    // Alternatively, a global service is better, but this solves the immediate UI issue simply.
  }

  checkAuthStatus() {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    const nombre = localStorage.getItem('nombre');
    const foto = localStorage.getItem('fotoUrl');
    this.isLoggedIn = !!token;
    if (role) {
      this.userRole = role;
    }
    if (nombre) {
      this.userName = nombre;
    }
    if (foto) {
      this.userPhoto = foto;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    this.isLoggedIn = false;
    window.location.href = '/login';
  }
}
