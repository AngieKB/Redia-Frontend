import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ReservationService } from '../../../core/services/reservation.service';

// Mesas predeterminadas del restaurante (fijas, sin gestión desde admin)
const MESAS_PREDETERMINADAS: { id: string; nombre: string; capacidad: number }[] = [
  { id: '1', nombre: '1', capacidad: 2 },
  { id: '2', nombre: '2', capacidad: 2 },
  { id: '3', nombre: '3', capacidad: 4 },
  { id: '4', nombre: '4', capacidad: 4 },
  { id: '5', nombre: '5', capacidad: 4 },
  { id: '6', nombre: '6', capacidad: 4 },
  { id: '7', nombre: '7', capacidad: 4 },
  { id: '8', nombre: '8', capacidad: 4 },
  { id: '9', nombre: '9', capacidad: 2 },
  { id: '10', nombre: '10', capacidad: 2 },
];

@Component({
  selector: 'app-dashboard-recepcionista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe, NavbarComponent, FooterComponent],
  templateUrl: './dashboard-recepcionista.component.html',
  styleUrl: './dashboard-recepcionista.component.css',
})
export class DashboardRecepcionista implements OnInit {
  today = new Date();
  isLoading = true;

  mesas: { id: string; nombre: string; capacidad: number }[] = [];
  reservasHoy: any[] = [];

  get reservasTotal() { return this.reservasHoy.length; }
  get reservasConfirmadas() { return this.reservasHoy.filter(r => r.estado?.toUpperCase() === 'CONFIRMADA').length; }
  get reservasCanceladas() { return this.reservasHoy.filter(r => r.estado?.toUpperCase() === 'CANCELADA').length; }
  get totalMesas() { return this.mesas.length; }

  constructor(
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // Mesas fijas — no se cargan desde el API
    this.mesas = MESAS_PREDETERMINADAS;

    // Load today's reservations
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => {
        const todayStr = this.today.toISOString().split('T')[0];
        this.reservasHoy = reservations.filter(r => {
          const fechaStr = typeof r.fechaReserva === 'string'
            ? r.fechaReserva.split('T')[0]
            : '';
          return fechaStr === todayStr;
        }).map(r => ({
          id: r.id,
          clienteEmail: r.clienteEmail || '—',
          clienteNombre: r.clienteNombre || '',
          horaEntrada: typeof r.fechaReserva === 'string' ? r.fechaReserva.substring(11, 16) : '—',
          horaSalida: typeof r.horaFinReserva === 'string' ? r.horaFinReserva.substring(11, 16) : '—',
          personas: r.numeroPersonas,
          estado: r.estado,
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando reservas:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(estado: string): string {
    if (!estado) return '';
    const map: Record<string, string> = {
      CONFIRMADA: 'status-confirmada',
      CANCELADA: 'status-cancelada',
      FINALIZADA: 'status-finalizada',
    };
    return map[estado?.toUpperCase()] ?? '';
  }
}
