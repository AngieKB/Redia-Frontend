import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkAuthStatus();
    // Re-check on every navigation so Google login photo appears immediately
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkAuthStatus();
    });
  }

  checkAuthStatus() {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    const nombre = localStorage.getItem('nombre');
    const foto = localStorage.getItem('fotoUrl');
    this.isLoggedIn = !!token;
    this.userRole = role || '';
    this.userName = nombre || '';
    this.userPhoto = foto || '';
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    // Clear ALL user-related keys from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('nombre');
    localStorage.removeItem('email');
    localStorage.removeItem('telefono');
    localStorage.removeItem('fotoUrl');
    this.isLoggedIn = false;
    this.userPhoto = '';
    this.userName = '';
    this.userRole = '';
    window.location.href = '/login';
  }
}
