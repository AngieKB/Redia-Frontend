export interface OrderDish {
  id: number;
  dishNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  notas?: string;
}

export interface Order {
  id: number;
  status: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'PAGADO' | 'CANCELADO';
  reservationId: string;
  clienteNombre: string;
  clienteEmail: string;
  meseroNombre: string;
  fechaCreacion: string;
  total: number;
  notas?: string;
  dishes: OrderDish[];
}

export interface OrderItemRequest {
  dishId: number;
  cantidad: number;
  notas?: string;
}

export interface CreateOrderRequest {
  reservationId: string;
  notas?: string;
  items: OrderItemRequest[];
}

export interface Dish {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imageUrl: string;
  available: boolean;
}

export interface ActiveReservation {
  id: string;
  clienteEmail: string;
  clienteNombre: string;
  fechaReserva: string;
  horaFinReserva: string;
  numeroPersonas: number;
  estado: string;
}
