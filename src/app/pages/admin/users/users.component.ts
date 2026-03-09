import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class Users implements OnInit {
  showModal = false;

  // Note: Backend requires a password on creation. Edit is not supported by backend currently.
  currentUser: any = { nombre: '', email: '', password: '', telefono: '', role: '' };

  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  isSaving = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Error al cargar usuarios.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalCrear() {
    this.currentUser = { nombre: '', email: '', password: '', telefono: '', role: '' };
    this.errorMessage = '';
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.errorMessage = '';
  }

  guardarUsuario() {
    this.errorMessage = '';
    if (!this.currentUser.nombre || !this.currentUser.email || !this.currentUser.password || !this.currentUser.role) {
      this.errorMessage = 'Los campos nombre, email, password y rol son obligatorios.';
      return;
    }

    this.isSaving = true;

    // Backend requires FormData with form-url-encoded fields due to @RequestParam
    const formData = new FormData();
    formData.append('nombre', this.currentUser.nombre);
    formData.append('email', this.currentUser.email);
    formData.append('password', this.currentUser.password);
    formData.append('telefono', this.currentUser.telefono || '');
    // Backend expects 'role', but frontend select model uses 'rol'. Mapping to role:
    formData.append('role', this.currentUser.role);

    this.userService.createUser(formData).pipe(
      finalize(() => {
        this.isSaving = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.cerrarModal();
        this.loadUsers();
        Swal.fire({
          title: '¡Guardado!',
          text: 'El usuario se creó correctamente.',
          icon: 'success',
          confirmButtonColor: '#bd1b5b'
        });
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || err?.error || 'Error al crear el usuario.';
        this.cdr.detectChanges();
      }
    });
  }

  eliminarUsuario(user: User) {
    Swal.fire({
      title: '¿Seguro que desea eliminarlo?',
      text: `Se eliminará al usuario "${user.nombre}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#888',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            // Instant UI update
            this.users = this.users.filter(u => u.id !== user.id);
            this.cdr.detectChanges();

            Swal.fire({
              title: '¡Eliminado!',
              text: 'El usuario ha sido eliminado.',
              icon: 'success',
              confirmButtonColor: '#bd1b5b'
            });
          },
          error: (err) => {
            this.errorMessage = err?.error?.message || 'Error al eliminar usuario.';
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
}
