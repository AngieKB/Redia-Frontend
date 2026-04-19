import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MenuService, DishRequest } from '../../../core/services/menu.service';
import { Dish } from '../../../models/order.model';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class AdminMenuComponent implements OnInit {
  dishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  isLoading = true;
  error = '';
  successMsg = '';

  // Filtros
  filterCategoria = '';
  filterEstado = 'all';
  categorias: string[] = [];

  // Modal
  showModal = false;
  isEditing = false;
  isSaving = false;
  editingId = '';
  confirmDeleteId = '';
  showDeleteConfirm = false;

  form: DishRequest = {
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    imageUrl: '',
    available: true,
  };

  constructor(private menuService: MenuService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadDishes();
  }

  loadDishes() {
    this.isLoading = true;
    this.menuService.getAllDishes().subscribe({
      next: (dishes) => {
        this.dishes = dishes;
        this.extractCategorias();
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los platillos.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  extractCategorias() {
    const cats = new Set(this.dishes.map((d) => d.categoria).filter(Boolean));
    this.categorias = Array.from(cats).sort();
  }

  applyFilters() {
    this.filteredDishes = this.dishes.filter((d) => {
      const matchCat = !this.filterCategoria || d.categoria === this.filterCategoria;
      const matchStatus =
        this.filterEstado === 'all' ||
        (this.filterEstado === 'active' && d.available) ||
        (this.filterEstado === 'inactive' && !d.available);
      return matchCat && matchStatus;
    });
  }

  openCreate() {
    this.isEditing = false;
    this.editingId = '';
    this.form = { nombre: '', descripcion: '', precio: 0, categoria: '', imageUrl: '', available: true };
    this.showModal = true;
  }

  openEdit(dish: Dish) {
    this.isEditing = true;
    this.editingId = dish.id as unknown as string;
    this.form = {
      nombre: dish.nombre,
      descripcion: dish.descripcion,
      precio: dish.precio,
      categoria: dish.categoria,
      imageUrl: dish.imageUrl,
      available: dish.available,
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.error = '';
  }

  saveForm() {
    if (!this.form.nombre || !this.form.descripcion || !this.form.precio || !this.form.categoria) {
      this.error = 'Completa todos los campos requeridos.';
      return;
    }

    this.isSaving = true;
    this.error = '';

    const obs = this.isEditing
      ? this.menuService.updateDish(this.editingId, this.form)
      : this.menuService.createDish(this.form);

    obs.subscribe({
      next: () => {
        this.isSaving = false;
        this.showModal = false;
        this.successMsg = this.isEditing ? 'Platillo actualizado.' : 'Platillo creado exitosamente.';
        this.loadDishes();
        setTimeout(() => { this.successMsg = ''; this.cdr.detectChanges(); }, 3500);
      },
      error: (err) => {
        this.isSaving = false;
        this.error = err?.error?.message || 'Error al guardar el platillo.';
        this.cdr.detectChanges();
      },
    });
  }

  askDelete(id: string) {
    this.confirmDeleteId = id;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.confirmDeleteId = '';
    this.showDeleteConfirm = false;
  }

  confirmDelete() {
    this.menuService.deleteDish(this.confirmDeleteId).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.confirmDeleteId = '';
        this.successMsg = 'Platillo eliminado.';
        this.loadDishes();
        setTimeout(() => { this.successMsg = ''; this.cdr.detectChanges(); }, 3500);
      },
      error: (err) => {
        this.showDeleteConfirm = false;
        this.error = err?.error?.message || 'No se pudo eliminar el platillo (puede estar asociado a pedidos).';
        this.cdr.detectChanges();
      },
    });
  }

  toggleAvailable(dish: Dish) {
    this.menuService.toggleDish(dish.id as unknown as string).subscribe({
      next: (updated) => {
        const idx = this.dishes.findIndex((d) => d.id === dish.id);
        if (idx !== -1) this.dishes[idx] = updated;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cambiar la disponibilidad.';
        this.cdr.detectChanges();
      },
    });
  }
}
