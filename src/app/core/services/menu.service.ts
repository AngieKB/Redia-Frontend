import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish } from '../../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private apiUrl = `${environment.apiUrlBase}/menu`;

  constructor(private http: HttpClient) {}

  /** Obtener platos disponibles (available = true) */
  getAvailableDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/dishes`);
  }
}
