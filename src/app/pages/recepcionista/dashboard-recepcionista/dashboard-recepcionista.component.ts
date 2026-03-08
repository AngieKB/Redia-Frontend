import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-dashboard-recepcionista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard-recepcionista.component.html',
  styleUrl: './dashboard-recepcionista.component.css',
})
export class DashboardRecepcionista implements OnInit {
  today = new Date();

  // 8 mesas de 4 personas cada una
  mesas = [
    { id: 1, ocupada: true },
    { id: 2, ocupada: true },
    { id: 3, ocupada: false },
    { id: 4, ocupada: true },
    { id: 5, ocupada: false },
    { id: 6, ocupada: true },
    { id: 7, ocupada: false },
    { id: 8, ocupada: false },
  ];

  reservasHoy: any[] = [
    {
      id: 1, cliente: 'María García', horaEntrada: '12:00', horaSalida: '14:00',
      personas: 3, estado: 'confirmada', cantMesas: 1, mesas: [1]
    },
    {
      id: 2, cliente: 'Carlos Ruiz', horaEntrada: '13:30', horaSalida: '15:30',
      personas: 4, estado: 'confirmada', cantMesas: 1, mesas: [2]
    },
    {
      id: 3, cliente: 'Ana Martínez', horaEntrada: '14:00', horaSalida: '16:00',
      personas: 8, estado: 'pendiente', cantMesas: 2, mesas: [4, 6]
    },
    {
      id: 4, cliente: 'Luis Hernández', horaEntrada: '19:00', horaSalida: '21:00',
      personas: 2, estado: 'pendiente', cantMesas: 1, mesas: [3]
    },
    {
      id: 5, cliente: 'Sara López', horaEntrada: '20:00', horaSalida: '22:00',
      personas: 6, estado: 'confirmada', cantMesas: 2, mesas: [5, 7]
    },
  ];

  get reservasTotal() { return this.reservasHoy.length; }
  get reservasConfirmadas() { return this.reservasHoy.filter(r => r.estado === 'confirmada').length; }
  get reservasPendientes() { return this.reservasHoy.filter(r => r.estado === 'pendiente').length; }
  get mesasOcupadas() { return this.mesas.filter(m => m.ocupada).length; }

  ngOnInit() { }

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
}
