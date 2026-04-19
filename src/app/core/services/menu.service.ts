import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish } from '../../models/order.model';
import { environment } from '../../../environments/environment';

export interface DishRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  available?: boolean;
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  private apiUrl = `${environment.apiUrlBase}/menu`;

  constructor(private http: HttpClient) {}

  /** Obtener platos disponibles (available = true) — para Mesero */
  getAvailableDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/dishes`);
  }

  /** Obtener TODOS los platos incluyendo inactivos — solo Admin */
  getAllDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/dishes/all`);
  }

  /** Crear un nuevo plato con imagen — solo Admin */
  createDish(formData: FormData): Observable<Dish> {
    return this.http.post<Dish>(`${this.apiUrl}/dishes`, formData);
  }

  /** Editar un plato existente con imagen opcional — solo Admin */
  updateDish(id: string, formData: FormData): Observable<Dish> {
    return this.http.put<Dish>(`${this.apiUrl}/dishes/${id}`, formData);
  }

  /** Eliminar un plato — solo Admin */
  deleteDish(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/dishes/${id}`);
  }

  /** Alternar disponibilidad de un plato — solo Admin */
  toggleDish(id: string): Observable<Dish> {
    return this.http.patch<Dish>(`${this.apiUrl}/dishes/${id}/toggle`, {});
  }
}
