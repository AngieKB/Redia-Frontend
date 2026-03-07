import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css',
})
export class DashboardAdmin {
  weekData = [
    { label: 'Lun', pct: 60 },
    { label: 'Mar', pct: 80 },
    { label: 'Mié', pct: 45 },
    { label: 'Jue', pct: 90 },
    { label: 'Vie', pct: 100 },
    { label: 'Sáb', pct: 75 },
    { label: 'Dom', pct: 30 },
  ];
}
