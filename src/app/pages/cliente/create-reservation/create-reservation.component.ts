import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-create-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.css',
})
export class CreateReservation implements OnInit {
  reservation = {
    fecha: '',
    horaEntrada: '',
    horaSalida: '',
    personas: '',
    ocasion: ''
  };

  minDate: string = '';

  constructor(private alertService: AlertService, private router: Router) { }

  ngOnInit() {
    // Set min date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  onHoraEntradaChange() {
    if (!this.reservation.horaEntrada) return;
    const [h, m] = this.reservation.horaEntrada.split(':').map(Number);
    const totalMin = h * 60 + m + 120; // + 2 horas max
    const maxH = Math.floor(totalMin / 60) % 24;
    const maxM = totalMin % 60;
    const maxTime = `${String(maxH).padStart(2, '0')}:${String(maxM).padStart(2, '0')}`;

    if (!this.reservation.horaSalida || this.reservation.horaSalida > maxTime) {
      this.reservation.horaSalida = maxTime;
    }
  }

  onSubmit() {
    console.log('Reserva a crear:', this.reservation);
    this.alertService.success('Tu reserva ha sido enviada y está a la espera de confirmación.')
    this.router.navigate(['/cliente/my-reservations'])
  }
}
