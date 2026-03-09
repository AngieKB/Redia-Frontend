import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DinningTable } from '../../models/table.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TableService {
    private apiUrl = `${environment.apiUrlBase}/admin/dinning-tables`;

    constructor(private http: HttpClient) { }

    getAllTables(): Observable<DinningTable[]> {
        return this.http.get<DinningTable[]>(this.apiUrl);
    }

    getTableById(id: string): Observable<DinningTable> {
        return this.http.get<DinningTable>(`${this.apiUrl}/${id}`);
    }

    createTable(data: { nombre: string; capacidad: number }): Observable<DinningTable> {
        return this.http.post<DinningTable>(this.apiUrl, data);
    }

    updateTable(id: string, data: { nombre: string; capacidad: number }): Observable<DinningTable> {
        return this.http.put<DinningTable>(`${this.apiUrl}/${id}`, data);
    }

    deleteTable(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
