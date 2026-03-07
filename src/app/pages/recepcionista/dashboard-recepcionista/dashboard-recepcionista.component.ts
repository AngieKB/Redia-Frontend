import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-dashboard-recepcionista',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, NavbarComponent, FooterComponent],
  templateUrl: './dashboard-recepcionista.component.html',
  styleUrl: './dashboard-recepcionista.component.css',
})
export class DashboardRecepcionista {
  proximasReservas: any[] = [
    {
      id: 1, cliente: 'María García', fecha: new Date('2026-03-07'),
      horaEntrada: '13:00', horaSalida: '14:00', personas: 3, estado: 'confirmada'
    },
    {
      id: 2, cliente: 'Carlos Ruiz', fecha: new Date('2026-03-07'),
      horaEntrada: '14:30', horaSalida: '15:30', personas: 2, estado: 'pendiente'
    }
  ];
}
