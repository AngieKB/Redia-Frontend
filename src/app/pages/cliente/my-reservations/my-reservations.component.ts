import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../models/reservation.model';

type ReservationStatus = 'SOLICITADA' | 'CONFIRMADA' | 'RECHAZADA' | 'CANCELADA' | 'FINALIZADA';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe, NavbarComponent, FooterComponent],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css',
})
export class MyReservations implements OnInit {
  filterStatus: ReservationStatus = 'CONFIRMADA';
  reservations: Reservation[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadMyReservations();
  }

  loadMyReservations() {
    this.isLoading = true;
    this.reservationService.getMyReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        console.log('Mis reservas cargadas y parseadas:', this.reservations);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching reservations:', err);
        this.errorMessage = err?.error?.message || 'Error al cargar tus reservas.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredReservations() {
    return this.reservations.filter(r => r.estado && r.estado.toUpperCase() === this.filterStatus);
  }

  setFilter(status: ReservationStatus) {
    this.filterStatus = status;
  }

  cancelarReserva(id: string) {
    if (confirm(`¿Deseas cancelar esta reserva de forma irreversible?`)) {
      this.reservationService.cancelReservation(id).subscribe({
        next: () => this.loadMyReservations(),
        error: (err) => alert('Error al cancelar: ' + (err?.error?.message || err?.error || ''))
      });
    }
  }

  getColorStatus(status: string) {
    if (!status) return 'status-default';
    switch (status.toUpperCase()) {
      case 'PENDIENTE': return 'status-solicitada';
      case 'CONFIRMADA': return 'status-confirmada';
      case 'CANCELADA': return 'status-cancelada';
      case 'RECHAZADA': return 'status-rechazada';
      case 'FINALIZADA': return 'status-finalizada';
      default: return 'status-default';
    }
  }
}
