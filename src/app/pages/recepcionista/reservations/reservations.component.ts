import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-recep-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe, NavbarComponent, FooterComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class Reservations {
  reservations: any[] = [
    { id: 1, cliente: 'María García', fecha: new Date('2026-03-07'), horaEntrada: '19:00', horaSalida: '20:30', personas: 4, estado: 'pendiente' },
    { id: 2, cliente: 'Carlos Ruiz', fecha: new Date('2026-03-08'), horaEntrada: '13:00', horaSalida: '14:00', personas: 2, estado: 'confirmada' },
    { id: 3, cliente: 'Ana Martínez', fecha: new Date('2026-03-09'), horaEntrada: '20:00', horaSalida: '21:30', personas: 6, estado: 'pendiente' }
  ];

  confirmarReserva(r: any) {
    if (r.estado === 'pendiente') r.estado = 'confirmada';
  }

  rechazarReserva(r: any) {
    if (r.estado === 'pendiente') r.estado = 'rechazada';
  }

  cancelarReserva(r: any) {
    if (r.estado !== 'cancelada' && r.estado !== 'finalizada') {
      if (confirm(`¿Cancelar reserva de ${r.cliente}?`)) r.estado = 'cancelada';
    }
  }
}
