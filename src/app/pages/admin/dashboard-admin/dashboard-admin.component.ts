import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

import { ReservationService } from '../../../core/services/reservation.service';
import { UserService } from '../../../core/services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css',
})
export class DashboardAdmin implements OnInit {
  isLoading = true;
  reservasHoy = 0;
  reservasMes = 0;
  usuariosRegistrados = 0;
  reservasCanceladas = 0;

  constructor(
    private reservationService: ReservationService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    forkJoin({
      reservations: this.reservationService.getAllReservations(),
      users: this.userService.getAllUsers()
    }).subscribe({
      next: ({ reservations, users }) => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        this.reservasHoy = reservations.filter(r => r.fechaReserva && r.fechaReserva.startsWith(todayStr)).length;

        this.reservasMes = reservations.filter(r => {
          if (!r.fechaReserva) return false;
          const rDate = new Date(r.fechaReserva);
          return rDate.getMonth() === currentMonth && rDate.getFullYear() === currentYear;
        }).length;

        this.reservasCanceladas = reservations.filter(r => r.estado && r.estado.toUpperCase() === 'CANCELADA').length;

        this.usuariosRegistrados = users.filter(u => u.role && u.role.toUpperCase() === 'CLIENTE').length;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading admin dashboard stats', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
