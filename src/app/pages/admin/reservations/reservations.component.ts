import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe, NavbarComponent, FooterComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class Reservations {
  reservations: any[] = [
    {
      id: 1, cliente: 'María García', fecha: new Date('2026-03-08'),
      horaEntrada: '19:00', horaSalida: '20:30', personas: 4,
      estado: 'confirmada', creadaEn: new Date('2026-03-01T10:30:00'), finalizadaEn: null
    },
    {
      id: 2, cliente: 'Carlos Ruiz', fecha: new Date('2026-03-08'),
      horaEntrada: '13:00', horaSalida: '14:00', personas: 2,
      estado: 'pendiente', creadaEn: new Date('2026-03-07T08:15:00'), finalizadaEn: null
    },
    {
      id: 3, cliente: 'Ana Martínez', fecha: new Date('2026-03-01'),
      horaEntrada: '20:00', horaSalida: '21:30', personas: 6,
      estado: 'finalizada', creadaEn: new Date('2026-02-25T11:00:00'), finalizadaEn: new Date('2026-03-01T21:32:00')
    }
  ];

  cancelarReserva(r: any) {
    if (r.estado === 'cancelada' || r.estado === 'finalizada') return;
    if (confirm(`¿Cancelar reserva #${r.id} de ${r.cliente}?`)) {
      r.estado = 'cancelada';
    }
  }
}
