import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe, NavbarComponent, FooterComponent],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css',
})
export class MyReservations {
  reservations: any[] = [
    { id: 1, fecha: new Date('2026-03-08'), horaEntrada: '19:00', horaSalida: '20:30', personas: 4, estado: 'confirmada' },
    { id: 2, fecha: new Date('2026-02-20'), horaEntrada: '13:00', horaSalida: '14:00', personas: 2, estado: 'finalizada' },
    { id: 3, fecha: new Date('2026-03-12'), horaEntrada: '20:00', horaSalida: '21:30', personas: 6, estado: 'pendiente' }
  ];

  verDetalle(r: any) {
    console.log('Ver detalle de reserva:', r);
  }

  cancelarReserva(r: any) {
    if (r.estado === 'cancelada' || r.estado === 'finalizada') return;
    if (confirm(`¿Deseas cancelar la reserva del ${r.fecha.toLocaleDateString()}?`)) {
      r.estado = 'cancelada';
    }
  }
}
