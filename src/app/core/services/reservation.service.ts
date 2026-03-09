import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reservation, CreateReservationRequest } from '../../models/reservation.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    private apiUrl = `${environment.apiUrlBase}/reservations`;

    constructor(private http: HttpClient) { }

    private sanitizeDates(reservations: Reservation[]): Reservation[] {
        return reservations.map(r => {
            let fReserva: any = r.fechaReserva;
            let hFin: any = r.horaFinReserva;
            const pad = (n: number) => String(n || 0).padStart(2, '0');

            if (Array.isArray(fReserva)) {
                const [y, m, d, h, min, s] = fReserva;
                fReserva = `${y}-${pad(m)}-${pad(d)}T${pad(h)}:${pad(min)}:${pad(s)}`;
            }
            if (Array.isArray(hFin)) {
                const [y, m, d, h, min, s] = hFin;
                hFin = `${y}-${pad(m)}-${pad(d)}T${pad(h)}:${pad(min)}:${pad(s)}`;
            }
            return { ...r, fechaReserva: fReserva, horaFinReserva: hFin };
        });
    }

    // ALL ROLES
    createReservation(data: CreateReservationRequest): Observable<Reservation> {
        return this.http.post<Reservation>(this.apiUrl, data);
    }

    // CLIENT ROLES
    getMyReservations(): Observable<Reservation[]> {
        return this.http.get<Reservation[]>(`${this.apiUrl}/my`).pipe(
            map(res => this.sanitizeDates(res))
        );
    }

    // ADMIN/RECEPCIONISTA ROLES
    getAllReservations(): Observable<Reservation[]> {
        return this.http.get<Reservation[]>(this.apiUrl).pipe(
            map(res => this.sanitizeDates(res))
        );
    }

    confirmReservation(id: string, tablesReq: { mesasIds: string[] }): Observable<any> {
        return this.http.put(`${this.apiUrl}/confirm-with-tables/${id}`, tablesReq, { responseType: 'text' });
    }

    rejectReservation(id: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/reject/${id}`, {}, { responseType: 'text' });
    }

    cancelReservation(id: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/cancel/${id}`, {}, { responseType: 'text' });
    }

    finishReservation(id: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/finish/${id}`, {}, { responseType: 'text' });
    }

    /** Returns all tables - accessible by recepcionista via /api/reservations/tables */
    getTablesForReservations(): Observable<{ id: string; nombre: string; capacidad: number }[]> {
        return this.http.get<{ id: string; nombre: string; capacidad: number }[]>(`${this.apiUrl}/tables`);
    }
}
