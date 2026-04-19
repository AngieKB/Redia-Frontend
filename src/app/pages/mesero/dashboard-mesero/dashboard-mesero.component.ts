import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { OrderService } from '../../../core/services/order.service';
import { MenuService } from '../../../core/services/menu.service';
import { Order, Dish, ActiveReservation, OrderItemRequest } from '../../../models/order.model';

@Component({
  selector: 'app-dashboard-mesero',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe, DatePipe, NavbarComponent, FooterComponent],
  templateUrl: './dashboard-mesero.component.html',
  styleUrl: './dashboard-mesero.component.css',
})
export class DashboardMeseroComponent implements OnInit, OnDestroy {

  // ── Estado general
  isLoading = true;
  activeTab: 'orders' | 'new-order' = 'orders';

  // ── Pedidos activos
  orders: Order[] = [];

  // ── Nuevo pedido
  reservations: ActiveReservation[] = [];
  dishes: Dish[] = [];
  selectedReservationId = '';
  orderNotas = '';
  cart: { dish: Dish; cantidad: number; notas: string }[] = [];
  dishFilter = '';
  creatingOrder = false;
  createSuccess = false;
  createError = '';

  // ── Polling
  private pollInterval: any;

  constructor(
    private orderService: OrderService,
    private menuService: MenuService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOrders();
    this.pollInterval = setInterval(() => this.loadOrders(), 15000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  loadOrders() {
    this.orderService.getMyOrders().subscribe({
      next: (orders) => { 
        this.orders = orders; 
        this.isLoading = false; 
        this.cdr.detectChanges();
      },
      error: () => { 
        this.isLoading = false; 
        this.cdr.detectChanges();
      }
    });
  }

  // ── Abrir formulario de nuevo pedido
  openNewOrder() {
    this.activeTab = 'new-order';
    this.isLoading = true;
    this.cart = [];
    this.selectedReservationId = '';
    this.orderNotas = '';
    this.createError = '';
    this.createSuccess = false;

    forkJoin({
      reservations: this.orderService.getActiveReservations(),
      dishes: this.menuService.getAvailableDishes()
    }).subscribe({
      next: (result) => {
        this.reservations = result.reservations;
        this.dishes = result.dishes;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.createError = 'Error de conexión. No se pudieron cargar los datos para el pedido.';
        this.cdr.detectChanges();
        console.error('Error cargando nuevo pedido:', err);
      }
    });
  }

  // ── Filtros del menú
  get filteredDishes(): Dish[] {
    return this.dishes.filter(d => {
      const matchQuery = d.nombre.toLowerCase().includes(this.dishFilter.toLowerCase());
      return matchQuery && d.available;
    });
  }

  // ── Carrito
  addToCart(dish: Dish) {
    const existing = this.cart.find(c => c.dish.id === dish.id);
    if (existing) {
      existing.cantidad++;
    } else {
      this.cart.push({ dish, cantidad: 1, notas: '' });
    }
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  get cartTotal(): number {
    return this.cart.reduce((sum, c) => sum + c.dish.precio * c.cantidad, 0);
  }

  // ── Enviar pedido
  submitOrder() {
    this.createError = '';
    if (!this.selectedReservationId) {
      this.createError = 'Selecciona una reserva.'; return;
    }
    if (this.cart.length === 0) {
      this.createError = 'Agrega al menos un plato al pedido.'; return;
    }

    this.creatingOrder = true;
    const items: OrderItemRequest[] = this.cart.map(c => ({
      dishId: c.dish.id,
      cantidad: c.cantidad,
      notas: c.notas || undefined
    }));

    this.orderService.createOrder({
      reservationId: this.selectedReservationId,
      notas: this.orderNotas || undefined,
      items
    }).subscribe({
      next: (order) => {
        this.creatingOrder = false;
        this.createSuccess = true;
        this.cdr.detectChanges();
        // Enviar automáticamente a cocina
        this.orderService.sendToKitchen(order.id).subscribe({
          next: () => {
            setTimeout(() => {
              this.activeTab = 'orders';
              this.loadOrders();
            }, 1500);
          },
          error: () => {
            setTimeout(() => { this.activeTab = 'orders'; this.loadOrders(); }, 1500);
          }
        });
      },
      error: (err) => {
        this.creatingOrder = false;
        this.createError = err?.error?.message || 'Error al crear el pedido.';
        this.cdr.detectChanges();
      }
    });
  }

  // ── Helpers
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDIENTE: 'Registrado',
      EN_PREPARACION: 'En Cocina',
      LISTO: 'Listo',
      PAGADO: 'Pagado',
      CANCELADO: 'Cancelado'
    };
    return labels[status] ?? status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      PENDIENTE: 'status-created',
      EN_PREPARACION: 'status-kitchen',
      LISTO: 'status-ready',
      PAGADO: 'status-paid',
      CANCELADO: 'status-cancelled'
    };
    return classes[status] ?? '';
  }

  trackById(_: number, item: any) { return item.id; }
}
