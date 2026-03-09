import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

import { ReservationService } from '../../../core/services/reservation.service';

// Colombian holidays for 2026 (YYYY-MM-DD)
const FESTIVOS_COLOMBIA_2026: Set<string> = new Set([
  '2026-01-01', '2026-04-02', '2026-04-03', '2026-05-01',
  '2026-05-18', '2026-06-08', '2026-06-15', '2026-07-20',
  '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
  '2026-11-16', '2026-12-08', '2026-12-25'
]);

@Component({
  selector: 'app-create-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.css',
})
export class CreateReservation implements OnInit {

  fecha = '';
  horaEntrada = '';
  horaSalida = '';
  numeroPersonas: number | null = null;

  minDate = '';
  minHoraEntrada = '08:00';
  maxHoraEntrada = '22:00';
  maxHoraSalida = '22:00';

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  errors = {
    fecha: '',
    horaEntrada: '',
    horaSalida: '',
    personas: ''
  };

  private readonly MAX_PERSONAS = 32;

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const today = new Date();
    // Advance one day so today is not selectable if we're past business hours
    this.minDate = today.toISOString().split('T')[0];
  }

  onFechaChange() {
    this.errors.fecha = '';
    this.horaEntrada = '';
    this.horaSalida = '';

    if (!this.fecha) return;

    const date = new Date(this.fecha + 'T00:00:00');
    const dow = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (dow === 0) {
      this.errors.fecha = 'No se permiten reservas los domingos.';
      this.fecha = '';
      return;
    }

    if (FESTIVOS_COLOMBIA_2026.has(this.fecha)) {
      this.errors.fecha = 'No se permiten reservas en festivos colombianos.';
      this.fecha = '';
      return;
    }

    // Update hour boundaries
    if (dow === 6) {
      // Saturday
      this.maxHoraEntrada = '16:00';
      this.maxHoraSalida = '16:00';
    } else {
      // Mon–Fri
      this.maxHoraEntrada = '22:00';
      this.maxHoraSalida = '22:00';
    }
  }

  onHoraEntradaChange() {
    this.errors.horaEntrada = '';
    this.horaSalida = '';
    if (!this.horaEntrada) return;

    const [h, m] = this.horaEntrada.split(':').map(Number);

    // Suggest end time = entrada + 1 hour (within 3h max)
    const suggestTotalMin = h * 60 + m + 60;
    const maxEndMin = h * 60 + m + 180;
    const limitMin = this.maxHoraSalida === '16:00' ? 16 * 60 : 22 * 60;
    const clampedMin = Math.min(suggestTotalMin, limitMin);

    const eH = Math.floor(clampedMin / 60);
    const eM = clampedMin % 60;
    this.horaSalida = `${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}`;
  }

  /** Computes the max allowed horaSalida given horaEntrada (entrada + 3h, capped at business close) */
  get maxHoraSalidaField(): string {
    if (!this.horaEntrada) return this.maxHoraSalida;
    const [h, m] = this.horaEntrada.split(':').map(Number);
    const closeMin = this.maxHoraSalida === '16:00' ? 16 * 60 : 22 * 60;
    const plus3 = h * 60 + m + 180;
    const capped = Math.min(plus3, closeMin);
    return `${String(Math.floor(capped / 60)).padStart(2, '0')}:${String(capped % 60).padStart(2, '0')}`;
  }

  /** Min allowed horaSalida = entrada + 1 minute */
  get minHoraSalidaField(): string {
    if (!this.horaEntrada) return '08:01';
    const [h, m] = this.horaEntrada.split(':').map(Number);
    const next = h * 60 + m + 1;
    return `${String(Math.floor(next / 60)).padStart(2, '0')}:${String(next % 60).padStart(2, '0')}`;
  }

  validate(): boolean {
    this.errors = { fecha: '', horaEntrada: '', horaSalida: '', personas: '' };
    let ok = true;

    if (!this.fecha) {
      this.errors.fecha = 'Selecciona una fecha.';
      ok = false;
    }

    if (!this.horaEntrada) {
      this.errors.horaEntrada = 'Selecciona la hora de entrada.';
      ok = false;
    }

    if (!this.horaSalida) {
      this.errors.horaSalida = 'Selecciona la hora de salida.';
      ok = false;
    }

    if (this.horaEntrada && this.horaSalida) {
      const [sh, sm] = this.horaEntrada.split(':').map(Number);
      const [eh, em] = this.horaSalida.split(':').map(Number);
      const durMin = (eh * 60 + em) - (sh * 60 + sm);

      if (durMin <= 0) {
        this.errors.horaSalida = 'La hora de salida debe ser posterior a la entrada.';
        ok = false;
      } else if (durMin > 180) {
        this.errors.horaSalida = 'La reserva no puede durar más de 3 horas.';
        ok = false;
      }
    }

    if (!this.numeroPersonas || this.numeroPersonas <= 0) {
      this.errors.personas = 'Indica el número de personas (mínimo 1).';
      ok = false;
    } else if (this.numeroPersonas > this.MAX_PERSONAS) {
      this.errors.personas = `El máximo permitido es ${this.MAX_PERSONAS} personas.`;
      ok = false;
    }

    return ok;
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.validate()) return;

    this.isLoading = true;

    const fechaReserva = `${this.fecha}T${this.horaEntrada}:00`;
    const horaFinReserva = `${this.fecha}T${this.horaSalida}:00`;

    const body = {
      fechaReserva,
      horaFinReserva,
      numeroPersonas: this.numeroPersonas as number
    };

    this.reservationService.createReservation(body).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/cliente/my-reservations']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Error al crear la reserva. Inténtalo de nuevo.';
        this.cdr.detectChanges();
      }
    });
  }
}
