import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

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
        this.applyFilters(); // Apply immediately
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
      // For date manipulation
      const fechaFull = r.fechaReserva ? r.fechaReserva.split('T')[0] : '';
      const horaFull = r.fechaReserva ? r.fechaReserva.split('T')[1].substring(0, 5) : '';

      const matchFecha = !this.filtroFecha || fechaFull === this.filtroFecha;
      const matchHora = !this.filtroHora || horaFull.startsWith(this.filtroHora);
      const matchEstado = !this.filtroEstado || r.estado.toLowerCase() === this.filtroEstado.toLowerCase();
      const matchCliente = !this.filtroCliente || r.clienteEmail.toLowerCase().includes(this.filtroCliente.toLowerCase());

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

  confirmarReserva(r: Reservation) {
    if (r.estado === 'SOLICITADA') {
      const ids = prompt('Ingrese los IDs de las mesas para asignar (separados por coma):');
      if (ids !== null) {
        const idsList = ids.split(',').map(s => s.trim()).filter(s => s.length > 0);
        this.reservationService.confirmReservation(r.id, { idsMesas: idsList }).subscribe({
          next: () => this.loadReservations(),
          error: (err) => alert('Error: ' + (err?.error?.message || err?.error || ''))
        });
      }
    }
  }

  rechazarReserva(r: Reservation) {
    if (r.estado === 'SOLICITADA') {
      if (confirm(`¿Rechazar reserva de ${r.clienteEmail}?`)) {
        this.reservationService.rejectReservation(r.id).subscribe({
          next: () => this.loadReservations(),
          error: (err) => alert('Error: ' + (err?.error?.message || err?.error || ''))
        });
      }
    }
  }

  cancelarReserva(r: Reservation) {
    if (r.estado !== 'CANCELADA' && r.estado !== 'FINALIZADA') {
      if (confirm(`¿Cancelar reserva de ${r.clienteEmail}?`)) {
        this.reservationService.cancelReservation(r.id).subscribe({
          next: () => this.loadReservations(),
          error: (err) => alert('Error: ' + (err?.error?.message || err?.error || ''))
        });
      }
    }
  }

  getStatusClass(estado: string): string {
    const map: Record<string, string> = {
      confirmada: 'status-confirmada',
      solicitada: 'status-solicitada',
      cancelada: 'status-cancelada',
      rechazada: 'status-rechazada',
      finalizada: 'status-finalizada',
    };
    return map[estado.toLowerCase()] ?? '';
  }

  canConfirm(r: Reservation): boolean { return r.estado === 'SOLICITADA'; }
  canReject(r: Reservation): boolean { return r.estado === 'SOLICITADA'; }
  canCancel(r: Reservation): boolean { return r.estado !== 'CANCELADA' && r.estado !== 'FINALIZADA' && r.estado !== 'RECHAZADA'; }
}
