import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-dashboard-cocinero',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, NavbarComponent, FooterComponent],
  templateUrl: './dashboard-cocinero.component.html',
  styleUrl: './dashboard-cocinero.component.css',
})
export class DashboardCocineroComponent implements OnInit, OnDestroy {
  isLoading = true;
  orders: Order[] = [];
  private pollInterval: any;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
    // Refrescar cada 10 segundos
    this.pollInterval = setInterval(() => this.loadOrders(), 10000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  loadOrders() {
    this.orderService.getKitchenOrders().subscribe({
      next: (orders) => {
        // Ordenar: IN_PROGRESS primero (ya trabajando), luego CREATED
        this.orders = orders.sort((a, b) => {
          if (a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS') return -1;
          if (a.status !== 'IN_PROGRESS' && b.status === 'IN_PROGRESS') return 1;
          // Si tienen el mismo estado, ordenar por fecha (más antiguo primero)
          return new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime();
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  markReady(orderId: number) {
    this.orderService.markReady(orderId).subscribe({
      next: () => {
        this.loadOrders(); // Recargar después de actualizar
      },
      error: (err) => {
        console.error('Error al marcar como listo', err);
        alert('Error: ' + (err?.error?.message || 'No se pudo actualizar el pedido'));
      }
    });
  }

  trackById(_: number, item: Order) {
    return item.id;
  }
}
