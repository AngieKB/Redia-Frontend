import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import Swal from 'sweetalert2';

import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../models/reservation.model';

import { AuthService } from '../../../core/services/auth.service';

type ReservationStatus = 'CONFIRMADA' | 'CANCELADA' | 'FINALIZADA';

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
    private authService: AuthService,
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

  canCancel(r: Reservation): boolean {
    const cancelableStatuses = ['CONFIRMADA'];
    if (!cancelableStatuses.includes(r.estado?.toUpperCase())) return false;
    const reservationTime = new Date(r.fechaReserva).getTime();
    const now = Date.now();
    const hoursUntil = (reservationTime - now) / (1000 * 60 * 60);
    return hoursUntil >= 24;
  }

  cancelarReserva(id: string) {
    Swal.fire({
      title: '¿Cancelar reserva?',
      text: 'Esta acción es irreversible. ¿Seguro que deseas cancelar esta reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bd1b5b',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener'
    }).then(result => {
      if (result.isConfirmed) {
        this.reservations = this.reservations.filter(r => r.id !== id);
        this.reservationService.cancelReservation(id).subscribe({
          next: () => {
            this.loadMyReservations();
            Swal.fire({
              title: '¡Cancelada!',
              text: 'Tu reserva ha sido cancelada.',
              icon: 'success',
              confirmButtonColor: '#bd1b5b'
            });
          },
          error: (err) => {
            this.loadMyReservations();
            Swal.fire('Error', 'No se pudo cancelar la reserva: ' + (err?.error?.message || ''), 'error');
          }
        });
      }
    });
  }

  getColorStatus(status: string) {
    if (!status) return 'status-default';
    switch (status.toUpperCase()) {

      case 'CONFIRMADA': return 'status-confirmada';
      case 'CANCELADA': return 'status-cancelada';
      case 'FINALIZADA': return 'status-finalizada';
      default: return 'status-default';
    }
  }

  requestDeletion() {
    Swal.fire({
      title: '¿Solicitar baja de cuenta?',
      text: 'Esta acción notificará al equipo de administración para eliminar definitivamente tus datos. Ya no podrás acceder a tu historial.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#888',
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.authService.requestDeletion().subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Solicitud enviada',
              text: 'Hemos recibido tu solicitud de baja de cuenta. Se procesará en breve.',
              icon: 'success',
              confirmButtonColor: '#bd1b5b'
            });
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo procesar tu solicitud. Intenta de nuevo.', 'error');
          }
        });
      }
    });
  }
}
