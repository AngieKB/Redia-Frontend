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
  filterEstado = 'all';

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
    available: true,
  };

  // Imágenes
  newFotoFile: File | null = null;
  newFotoPreview: string = '';
  currentImageUrl: string = ''; // Opcional, para mostrar en el modal lo que ya tenía

  constructor(private menuService: MenuService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadDishes();
  }

  loadDishes() {
    this.isLoading = true;
    this.menuService.getAllDishes().subscribe({
      next: (dishes) => {
        this.dishes = dishes;
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

  applyFilters() {
    this.filteredDishes = this.dishes.filter((d) => {
      const matchStatus =
        this.filterEstado === 'all' ||
        (this.filterEstado === 'active' && d.available) ||
        (this.filterEstado === 'inactive' && !d.available);
      return matchStatus;
    });
  }

  openCreate() {
    this.isEditing = false;
    this.editingId = '';
    this.form = { nombre: '', descripcion: '', precio: 0, available: true };
    this.newFotoFile = null;
    this.newFotoPreview = '';
    this.currentImageUrl = '';
    this.showModal = true;
  }

  openEdit(dish: Dish) {
    this.isEditing = true;
    this.editingId = dish.id as unknown as string;
    this.form = {
      nombre: dish.nombre,
      descripcion: dish.descripcion,
      precio: dish.precio,
      available: dish.available,
    };
    this.newFotoFile = null;
    this.newFotoPreview = '';
    this.currentImageUrl = dish.imageUrl || '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.error = '';
  }

  onFotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newFotoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newFotoPreview = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.newFotoFile);
    }
  }

  saveForm() {
    if (!this.form.nombre || !this.form.descripcion || !this.form.precio) {
      this.error = 'Completa todos los campos requeridos.';
      return;
    }

    // Validación de imagen en CREACIÓN
    if (!this.isEditing && !this.newFotoFile) {
      this.error = 'Debes subir una imagen para el nuevo platillo.';
      return;
    }

    this.isSaving = true;
    this.error = '';

    const formData = new FormData();
    formData.append('nombre', this.form.nombre);
    formData.append('descripcion', this.form.descripcion);
    formData.append('precio', this.form.precio.toString());
    formData.append('available', this.form.available ? 'true' : 'false');
    
    if (this.newFotoFile) {
      formData.append('image', this.newFotoFile);
    }

    const obs = this.isEditing
      ? this.menuService.updateDish(this.editingId, formData)
      : this.menuService.createDish(formData);

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
