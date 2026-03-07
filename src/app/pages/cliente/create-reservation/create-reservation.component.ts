import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-create-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.css',
})
export class CreateReservation {
  reservation = {
    fecha: '',
    horaEntrada: '',
    horaSalida: '',
    personas: null
  };

  onHoraEntradaChange() {
    if (!this.reservation.horaEntrada) return;
    const [h, m] = this.reservation.horaEntrada.split(':').map(Number);
    const totalMin = h * 60 + m + 120;
    const maxH = Math.floor(totalMin / 60) % 24;
    const maxM = totalMin % 60;
    const maxTime = `${String(maxH).padStart(2, '0')}:${String(maxM).padStart(2, '0')}`;
    if (!this.reservation.horaSalida || this.reservation.horaSalida > maxTime) {
      this.reservation.horaSalida = maxTime;
    }
  }

  onSubmit() {
    console.log('Reserva creada:', this.reservation);
  }
}
