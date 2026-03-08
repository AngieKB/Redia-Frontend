import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

type ReservationStatus = 'SOLICITADA' | 'CONFIRMADA' | 'RECHAZADA' | 'CANCELADA' | 'FINALIZADA';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe, NavbarComponent, FooterComponent],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css',
})
export class MyReservations {
  filterStatus: ReservationStatus = 'CONFIRMADA';

  reservations: any[] = [
    { id: '1', fecha: new Date('2026-03-08T19:00:00'), numeroPersonas: 4, estado: 'CONFIRMADA' },
    { id: '2', fecha: new Date('2026-03-10T14:00:00'), numeroPersonas: 2, estado: 'FINALIZADA' },
    { id: '3', fecha: new Date('2026-03-05T19:30:00'), numeroPersonas: 2, estado: 'CANCELADA' },
    { id: '4', fecha: new Date('2026-03-11T20:00:00'), numeroPersonas: 6, estado: 'SOLICITADA' },
    { id: '5', fecha: new Date('2026-03-01T21:00:00'), numeroPersonas: 15, estado: 'RECHAZADA' },
  ];

  get filteredReservations() {
    return this.reservations.filter(r => r.estado === this.filterStatus);
  }

  setFilter(status: ReservationStatus) {
    this.filterStatus = status;
  }

  cancelarReserva(id: string) {
    if (confirm(`¿Deseas cancelar esta reserva?`)) {
      this.reservations = this.reservations.map(r => r.id === id ? { ...r, estado: 'CANCELADA' } : r);
    }
  }

  getColorStatus(status: string) {
    switch (status) {
      case 'SOLICITADA': return 'status-solicitada';
      case 'CONFIRMADA': return 'status-confirmada';
      case 'CANCELADA': return 'status-cancelada';
      case 'RECHAZADA': return 'status-rechazada';
      case 'FINALIZADA': return 'status-finalizada';
      default: return 'status-default';
    }
  }
}
