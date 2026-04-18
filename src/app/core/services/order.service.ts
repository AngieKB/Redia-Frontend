import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest, ActiveReservation } from '../../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrlBase}/orders`;

  constructor(private http: HttpClient) {}

  /** MESERO: Crear un pedido */
  createOrder(data: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, data);
  }

  /** MESERO: Ver mis pedidos activos */
  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my`);
  }

  /** MESERO: Enviar pedido a cocina */
  sendToKitchen(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/send-to-kitchen`, {});
  }

  /** MESERO: Obtener reservas activas para crear pedido */
  getActiveReservations(): Observable<ActiveReservation[]> {
    return this.http.get<ActiveReservation[]>(`${this.apiUrl}/reservations/active`);
  }

  /** COCINERO: Ver cola de cocina */
  getKitchenOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/kitchen`);
  }

  /** COCINERO: Marcar pedido como listo */
  markReady(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/mark-ready`, {});
  }

  /** CAJERO: Ver pedidos listos */
  getCashierOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/cashier`);
  }

  /** CAJERO: Registrar pago */
  payOrder(id: number, metodoPago: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/pay`, { metodoPago });
  }

  /** Ver detalle de un pedido */
  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
}
