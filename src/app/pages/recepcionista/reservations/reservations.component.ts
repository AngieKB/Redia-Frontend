import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import Swal from 'sweetalert2';

import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../models/reservation.model';

@Component({
  selector: 'app-recep-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe, NavbarComponent, FooterComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class Reservations implements OnInit {
  // Filters
  filtroFecha = '';
  filtroHora = '';
  filtroEstado = '';
  filtroCliente = '';

  allReservations: Reservation[] = [];
  reservations: Reservation[] = [];

  isLoading = false;
  errorMessage = '';

  constructor(
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.isLoading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.allReservations = data;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Error al cargar las reservas.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    this.reservations = this.allReservations.filter(r => {
      const fechaFull = r.fechaReserva ? r.fechaReserva.split('T')[0] : '';
      const horaFull = r.fechaReserva ? r.fechaReserva.split('T')[1]?.substring(0, 5) : '';
      const matchFecha = !this.filtroFecha || fechaFull === this.filtroFecha;
      const matchHora = !this.filtroHora || horaFull?.startsWith(this.filtroHora);
      const matchEstado = !this.filtroEstado || r.estado.toLowerCase() === this.filtroEstado.toLowerCase();
      const searchTerm = this.filtroCliente.toLowerCase();
      const matchCliente = !searchTerm
        || r.clienteEmail.toLowerCase().includes(searchTerm)
        || (r.clienteNombre ?? '').toLowerCase().includes(searchTerm);
      return matchFecha && matchHora && matchEstado && matchCliente;
    });
  }

  clearFilters() {
    this.filtroFecha = '';
    this.filtroHora = '';
    this.filtroEstado = '';
    this.filtroCliente = '';
    this.applyFilters();
  }

  cancelarReserva(r: Reservation) {
    if (r.estado === 'CANCELADA' || r.estado === 'FINALIZADA') return;
    Swal.fire({
      title: '¿Cancelar reserva?',
      text: `Cancelarás la reserva de ${r.clienteNombre || r.clienteEmail}. Esta acción es irreversible.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bd1b5b',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    }).then(result => {
      if (result.isConfirmed) {
        // Optimistic UI update
        this.reservations = this.reservations.map(res =>
          res.id === r.id ? { ...res, estado: 'CANCELADA' } : res
        );
        this.reservationService.forceCancelReservation(r.id).subscribe({
          next: () => {
            this.loadReservations();
            Swal.fire({ title: '¡Cancelada!', text: 'La reserva fue cancelada.', icon: 'success', confirmButtonColor: '#bd1b5b' });
          },
          error: (err) => {
            this.loadReservations();
            Swal.fire('Error', err?.error?.message || 'No se pudo cancelar.', 'error');
          }
        });
      }
    });
  }

  getStatusClass(estado: string): string {
    const map: Record<string, string> = {
      CONFIRMADA: 'status-confirmada',
      CANCELADA: 'status-cancelada',
      RECHAZADA: 'status-rechazada',
      FINALIZADA: 'status-finalizada',
    };
    return map[estado?.toUpperCase()] ?? '';
  }

  canCancel(r: Reservation): boolean {
    return r.estado !== 'CANCELADA' && r.estado !== 'FINALIZADA' && r.estado !== 'RECHAZADA';
  }
}
