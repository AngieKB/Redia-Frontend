import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TableAvailability } from '../../../models/reservation.model';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ReservationService } from '../../../core/services/reservation.service';

// Mesas predeterminadas del restaurante
// Mesas 1,2,9,10 = 2 personas | Mesas 3,4,5,6,7,8 = 4 personas
const MESAS_PREDETERMINADAS: { svgId: string; capacidad: number }[] = [
  { svgId: '1', capacidad: 2 },
  { svgId: '2', capacidad: 2 },
  { svgId: '3', capacidad: 4 },
  { svgId: '4', capacidad: 4 },
  { svgId: '5', capacidad: 4 },
  { svgId: '6', capacidad: 4 },
  { svgId: '7', capacidad: 4 },
  { svgId: '8', capacidad: 4 },
  { svgId: '9', capacidad: 2 },
  { svgId: '10', capacidad: 2 },
];

// Colombian holidays for 2026 (YYYY-MM-DD)
const FESTIVOS_COLOMBIA_2026: Set<string> = new Set([
  '2026-01-01', '2026-04-02', '2026-04-03', '2026-05-01',
  '2026-05-18', '2026-06-08', '2026-06-15', '2026-07-20',
  '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
  '2026-11-16', '2026-12-08', '2026-12-25'
]);

@Component({
  selector: 'app-create-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.css',
})
export class CreateReservation implements OnInit {

  fecha = '';
  intervaloSeleccionado = '';
  numeroPersonas: number | null = null;

  minDate = '';
  intervalos: { label: string, entrada: string, salida: string }[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  errors = {
    fecha: '',
    intervalo: '',
    personas: ''
  };

  mesas: TableAvailability[] = [];
  mesasSeleccionadas: string[] = [];
  mostrarMapa = false;
  isFetchingTables = false;

  private readonly MAX_PERSONAS = 32;

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const today = new Date();
    // Advance one day so today is not selectable if we're past business hours
    this.minDate = today.toISOString().split('T')[0];
  }

  onFechaChange() {
    this.errors.fecha = '';
    this.intervaloSeleccionado = '';
    this.mostrarMapa = false;
    this.intervalos = [];

    if (!this.fecha) return;

    const date = new Date(this.fecha + 'T00:00:00');
    let dow = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (dow === 0) {
      this.errors.fecha = 'No se permiten reservas los domingos.';
      this.fecha = '';
      return;
    }

    if (FESTIVOS_COLOMBIA_2026.has(this.fecha)) {
      this.errors.fecha = 'No se permiten reservas en festivos colombianos.';
      this.fecha = '';
      return;
    }

    const maxH = (dow === 6) ? 16 : 22;
    for (let h = 8; h < maxH; h += 2) {
      const eH = String(h).padStart(2, '0');
      const sH = String(h + 2).padStart(2, '0');
      this.intervalos.push({
        label: `${eH}:00 - ${sH}:00`,
        entrada: `${eH}:00`,
        salida: `${sH}:00`
      });
    }
  }

  onIntervaloChange() {
    this.errors.intervalo = '';
    this.mostrarMapa = false;
  }

  validate(): boolean {
    this.errors = { fecha: '', intervalo: '', personas: '' };
    let ok = true;

    if (!this.fecha) {
      this.errors.fecha = 'Selecciona una fecha.';
      ok = false;
    }

    if (!this.intervaloSeleccionado) {
      this.errors.intervalo = 'Selecciona un intervalo horario.';
      ok = false;
    }

    if (!this.numeroPersonas || this.numeroPersonas <= 0) {
      this.errors.personas = 'Indica el número de personas (mínimo 1).';
      ok = false;
    } else if (this.numeroPersonas > this.MAX_PERSONAS) {
      this.errors.personas = `El máximo permitido es ${this.MAX_PERSONAS} personas.`;
      ok = false;
    }

    return ok;
  }

  fetchDisponibilidadMesas() {
    if (!this.validate()) return;

    this.isFetchingTables = true;
    this.mostrarMapa = false;

    const selected = this.intervalos.find(i => i.label === this.intervaloSeleccionado);
    if (!selected) return;

    const inicio = `${this.fecha}T${selected.entrada}:00`;
    const fin = `${this.fecha}T${selected.salida}:00`;

    this.reservationService.getMesasDisponibles(inicio, fin).subscribe({
      next: (mesasBackend) => {
        // Normalize the backend response against the predefined list.
        // For each predefined table, find its backend entry by flexible name matching.
        // If the backend doesn't return it (table not created in DB), treat it as available.
        this.mesas = MESAS_PREDETERMINADAS.map(predef => {
          const match = mesasBackend.find(m => {
            const n = (m.nombre || '').trim().toLowerCase();
            return n === predef.svgId || n === 'mesa ' + predef.svgId;
          });
          if (match) {
            // Return the backend record but ensure nombre equals the SVG id for easy lookup
            return { ...match, nombre: predef.svgId };
          }
          // Not found in backend — treat as available with predefined capacity
          return {
            id: predef.svgId,
            nombre: predef.svgId,
            capacidad: predef.capacidad,
            disponible: true
          };
        });
        this.mesasSeleccionadas = [];
        this.mostrarMapa = true;
        this.isFetchingTables = false;
        this.cdr.detectChanges();
      },
      error: (_err) => {
        this.isFetchingTables = false;
        this.errorMessage = 'Error obteniendo mesas. Inténtalo de nuevo.';
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Finds a mesa from the normalized list by its SVG id (e.g. '1', '2', ...'10').
   * After fetchDisponibilidadMesas runs, all names are normalized to the SVG id format.
   */
  getMesaByNombre(svgId: string): TableAvailability | undefined {
    return this.mesas.find(m => m.nombre === svgId);
  }

  isMesaDisponible(nombreMesa: string): boolean {
    const mesa = this.getMesaByNombre(nombreMesa);
    return mesa ? mesa.disponible : false;
  }

  isMesaSeleccionada(nombreMesa: string): boolean {
    const mesa = this.getMesaByNombre(nombreMesa);
    return mesa ? this.mesasSeleccionadas.includes(mesa.id) : false;
  }

  seleccionarMesa(nombreMesa: string) {
    const mesa = this.getMesaByNombre(nombreMesa);
    if (!mesa || !mesa.disponible) return;

    const index = this.mesasSeleccionadas.indexOf(mesa.id);
    if (index > -1) {
      // Deseleccionar siempre está permitido
      this.mesasSeleccionadas.splice(index, 1);
    } else {
      // Verificar que agregar esta mesa no exceda las personas en más de 2
      const capacidadConNuevaMesa = this.totalCapacidadSeleccionada + mesa.capacidad;
      const personas = this.numeroPersonas || 0;
      if (capacidadConNuevaMesa > personas + 2) {
        this.errorMessage = `No puedes agregar esa mesa: la capacidad total (${capacidadConNuevaMesa}) superaría con creces el número de personas indicado (${personas}).`;
        this.cdr.detectChanges();
        return;
      }
      this.errorMessage = '';
      this.mesasSeleccionadas.push(mesa.id);
    }
  }

  get totalCapacidadSeleccionada(): number {
    return this.mesas
      .filter(m => this.mesasSeleccionadas.includes(m.id))
      .reduce((sum, m) => sum + m.capacidad, 0);
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.validate()) return;

    if (!this.mostrarMapa) {
      this.fetchDisponibilidadMesas();
      return;
    }

    if (this.mesasSeleccionadas.length === 0) {
      this.errorMessage = 'Debes seleccionar al menos una mesa en el mapa.';
      return;
    }

    if (this.totalCapacidadSeleccionada < (this.numeroPersonas || 0)) {
      this.errorMessage = `Las mesas que seleccionaste solo tienen capacidad para ${this.totalCapacidadSeleccionada} personas, pero indicaste ${this.numeroPersonas}.`;
      return;
    }

    this.isLoading = true;

    const selected = this.intervalos.find(i => i.label === this.intervaloSeleccionado);

    const body = {
      fechaReserva: `${this.fecha}T${selected!.entrada}:00`,
      horaFinReserva: `${this.fecha}T${selected!.salida}:00`,
      numeroPersonas: this.numeroPersonas as number,
      tableIds: this.mesasSeleccionadas
    };

    this.reservationService.createReservation(body).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/cliente/my-reservations']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Error al crear la reserva. Inténtalo de nuevo.';
        this.cdr.detectChanges();
      }
    });
  }
}
