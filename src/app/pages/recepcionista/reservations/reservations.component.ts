import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-recep-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class Reservations implements OnInit {
  // Filters
  filtroFecha = '';
  filtroHora = '';
  filtroEstado = '';
  filtroCliente = '';
  filtroMesa: number | null = null;

  allReservations: any[] = [
    { id: 1, cliente: 'María García', fecha: '2026-03-07', horaEntrada: '12:00', horaSalida: '14:00', personas: 3, estado: 'confirmada', cantMesas: 1, mesas: [1] },
    { id: 2, cliente: 'Carlos Ruiz', fecha: '2026-03-07', horaEntrada: '13:30', horaSalida: '15:30', personas: 4, estado: 'pendiente', cantMesas: 1, mesas: [2] },
    { id: 3, cliente: 'Ana Martínez', fecha: '2026-03-07', horaEntrada: '14:00', horaSalida: '16:00', personas: 8, estado: 'pendiente', cantMesas: 2, mesas: [4, 6] },
    { id: 4, cliente: 'Luis Hernández', fecha: '2026-03-07', horaEntrada: '19:00', horaSalida: '21:00', personas: 2, estado: 'rechazada', cantMesas: 1, mesas: [3] },
    { id: 5, cliente: 'Sara López', fecha: '2026-03-07', horaEntrada: '20:00', horaSalida: '22:00', personas: 6, estado: 'confirmada', cantMesas: 2, mesas: [5, 7] },
    { id: 6, cliente: 'Pedro Gómez', fecha: '2026-03-08', horaEntrada: '13:00', horaSalida: '15:00', personas: 4, estado: 'pendiente', cantMesas: 1, mesas: [1] },
    { id: 7, cliente: 'Laura Díaz', fecha: '2026-03-08', horaEntrada: '20:30', horaSalida: '22:30', personas: 2, estado: 'confirmada', cantMesas: 1, mesas: [3] },
    { id: 8, cliente: 'Jorge Ríos', fecha: '2026-03-09', horaEntrada: '14:00', horaSalida: '16:00', personas: 12, estado: 'pendiente', cantMesas: 3, mesas: [2, 4, 8] },
  ];

  reservations: any[] = [];

  ngOnInit() {
    this.reservations = [...this.allReservations];
  }

  applyFilters() {
    this.reservations = this.allReservations.filter(r => {
      const matchFecha = !this.filtroFecha || r.fecha === this.filtroFecha;
      const matchHora = !this.filtroHora || r.horaEntrada.startsWith(this.filtroHora);
      const matchEstado = !this.filtroEstado || r.estado === this.filtroEstado;
      const matchCliente = !this.filtroCliente || r.cliente.toLowerCase().includes(this.filtroCliente.toLowerCase());
      const matchMesa = !this.filtroMesa || r.mesas.includes(Number(this.filtroMesa));
      return matchFecha && matchHora && matchEstado && matchCliente && matchMesa;
    });
  }

  clearFilters() {
    this.filtroFecha = '';
    this.filtroHora = '';
    this.filtroEstado = '';
    this.filtroCliente = '';
    this.filtroMesa = null;
    this.reservations = [...this.allReservations];
  }

  confirmarReserva(r: any) {
    if (r.estado === 'pendiente') r.estado = 'confirmada';
  }

  rechazarReserva(r: any) {
    if (r.estado === 'pendiente') r.estado = 'rechazada';
  }

  cancelarReserva(r: any) {
    if (r.estado !== 'cancelada' && r.estado !== 'finalizada') {
      r.estado = 'cancelada';
    }
  }

  getStatusClass(estado: string): string {
    const map: Record<string, string> = {
      confirmada: 'status-confirmada',
      pendiente: 'status-pendiente',
      cancelada: 'status-cancelada',
      rechazada: 'status-rechazada',
      finalizada: 'status-finalizada',
    };
    return map[estado] ?? '';
  }

  canConfirm(r: any): boolean { return r.estado === 'pendiente'; }
  canReject(r: any): boolean { return r.estado === 'pendiente'; }
  canCancel(r: any): boolean { return r.estado !== 'cancelada' && r.estado !== 'finalizada' && r.estado !== 'rechazada'; }
}
