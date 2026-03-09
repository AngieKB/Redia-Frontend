import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

import { TableService } from '../../../core/services/table.service';
import { DinningTable } from '../../../models/table.model';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-tables',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
    templateUrl: './tables.component.html',
    styleUrl: './tables.component.css',
})
export class TablesComponent implements OnInit {

    tables: DinningTable[] = [];
    isLoading = false;
    errorMessage = '';

    // Form for create/edit
    showForm = false;
    editingTable: DinningTable | null = null;
    formNombre = '';
    formCapacidad: number | null = null;
    formError = '';
    isSaving = false;

    constructor(
        private tableService: TableService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadTables();
    }

    loadTables() {
        this.isLoading = true;
        this.tableService.getAllTables().subscribe({
            next: (data) => {
                this.tables = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.errorMessage = err?.error?.message || 'Error al cargar las mesas.';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    openCreate() {
        this.editingTable = null;
        this.formNombre = '';
        this.formCapacidad = null;
        this.formError = '';
        this.showForm = true;
    }

    openEdit(table: DinningTable) {
        this.editingTable = table;
        this.formNombre = table.nombre;
        this.formCapacidad = table.capacidad;
        this.formError = '';
        this.showForm = true;
    }

    closeForm() {
        this.showForm = false;
        this.editingTable = null;
        this.formError = '';
    }

    save() {
        this.formError = '';
        if (!this.formNombre.trim()) {
            this.formError = 'El nombre de la mesa es obligatorio.';
            return;
        }
        if (!this.formCapacidad || this.formCapacidad <= 0) {
            this.formError = 'La capacidad debe ser mayor a 0.';
            return;
        }

        this.isSaving = true;
        const body = { nombre: this.formNombre.trim(), capacidad: this.formCapacidad };

        const request = this.editingTable
            ? this.tableService.updateTable(this.editingTable.id, body)
            : this.tableService.createTable(body);

        request.pipe(
            finalize(() => {
                this.isSaving = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: () => {
                this.closeForm();
                this.loadTables();
                Swal.fire({
                    title: '¡Guardado!',
                    text: 'La mesa se guardó correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#bd1b5b'
                });
            },
            error: (err) => {
                this.formError = err?.error?.message || 'Error al guardar la mesa.';
                this.cdr.detectChanges();
            }
        });
    }

    delete(table: DinningTable) {
        Swal.fire({
            title: '¿Seguro que desea eliminar esta mesa?',
            text: `Se eliminará la mesa "${table.nombre}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e53935',
            cancelButtonColor: '#888',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.tableService.deleteTable(table.id).subscribe({
                    next: () => {
                        // Instant UI update
                        this.tables = this.tables.filter(t => t.id !== table.id);
                        this.cdr.detectChanges();

                        Swal.fire({
                            title: '¡Eliminada!',
                            text: 'La mesa ha sido eliminada.',
                            icon: 'success',
                            confirmButtonColor: '#bd1b5b'
                        });
                    },
                    error: (err) => {
                        this.errorMessage = err?.error?.message || 'Error al eliminar la mesa.';
                        this.cdr.detectChanges();
                    }
                });
            }
        });
    }
}
