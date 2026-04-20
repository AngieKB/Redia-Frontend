import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef) {}

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
        // Ordenar: EN_PREPARACION primero (ya trabajando), luego PENDIENTE
        this.orders = orders.sort((a, b) => {
          if (a.status === 'EN_PREPARACION' && b.status !== 'EN_PREPARACION') return -1;
          if (a.status !== 'EN_PREPARACION' && b.status === 'EN_PREPARACION') return 1;
          // Si tienen el mismo estado, ordenar por fecha (más antiguo primero)
          return new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime();
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Set para guardar los IDs de los platillos marcados como completados
  // Se usa un Set para que sobreviva a las recargas del pollInterval
  checkedDishes = new Set<number>();

  toggleDish(dishId: number) {
    if (this.checkedDishes.has(dishId)) {
      this.checkedDishes.delete(dishId);
    } else {
      this.checkedDishes.add(dishId);
    }
  }

  isDishChecked(dishId: number): boolean {
    return this.checkedDishes.has(dishId);
  }

  markReady(orderId: number) {
    this.orderService.markReady(orderId).subscribe({
      next: () => {
        this.loadOrders(); // Recargar después de actualizar
      },
      error: (err) => {
        console.error('Error al marcar como listo', err);
        alert('Error: ' + (err?.error?.message || 'No se pudo actualizar el pedido'));
        this.cdr.detectChanges();
      }
    });
  }

  trackById(_: number, item: Order) {
    return item.id;
  }
}
