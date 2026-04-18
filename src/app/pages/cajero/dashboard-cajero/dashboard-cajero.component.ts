import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-dashboard-cajero',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe, DatePipe, NavbarComponent, FooterComponent],
  templateUrl: './dashboard-cajero.component.html',
  styleUrl: './dashboard-cajero.component.css',
})
export class DashboardCajeroComponent implements OnInit, OnDestroy {
  isLoading = true;
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  metodoPago = 'EFECTIVO';
  isPaying = false;
  today = new Date();
  
  private pollInterval: any;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
    this.pollInterval = setInterval(() => this.loadOrders(), 15000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  loadOrders() {
    this.orderService.getCashierOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
        
        // Actualizar la orden seleccionada si sigue en la lista
        if (this.selectedOrder) {
          const updated = this.orders.find(o => o.id === this.selectedOrder!.id);
          if (updated) {
            this.selectedOrder = updated;
          } else {
            this.selectedOrder = null;
          }
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  selectOrder(order: Order) {
    this.selectedOrder = order;
    this.metodoPago = 'EFECTIVO'; // Reset default
  }

  processPayment() {
    if (!this.selectedOrder) return;
    
    this.isPaying = true;
    this.orderService.payOrder(this.selectedOrder.id, this.metodoPago).subscribe({
      next: () => {
        this.isPaying = false;
        this.selectedOrder = null;
        this.loadOrders();
      },
      error: (err) => {
        this.isPaying = false;
        alert('Error al registrar pago: ' + (err?.error?.message || 'Error desconocido'));
      }
    });
  }

  trackById(_: number, item: Order) {
    return item.id;
  }
}
