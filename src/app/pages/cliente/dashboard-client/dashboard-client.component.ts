import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
    selector: 'app-dashboard-client',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
    templateUrl: './dashboard-client.component.html',
    styleUrls: ['./dashboard-client.component.css'],
})
export class DashboardClientComponent {
    proximaReserva = {
        fecha: 'Sábado, 8 Mar 2026',
        hora: '19:00 – 20:30',
        personas: 4
    };
    totalReservas = 12;
}
