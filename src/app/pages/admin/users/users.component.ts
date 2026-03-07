import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class Users {
  showModal = false;
  editMode = false;
  currentUser: any = { nombre: '', email: '', telefono: '', rol: '' };

  users: any[] = [
    { id: 1, nombre: 'Admin Principal', email: 'admin@redia.com', telefono: '+57 300 111 2222', rol: 'admin' },
    { id: 2, nombre: 'Juan Recepción', email: 'juan@redia.com', telefono: '+57 310 333 4444', rol: 'recepcionista' },
    { id: 3, nombre: 'María García', email: 'maria@email.com', telefono: '+57 320 555 6666', rol: 'cliente' },
    { id: 4, nombre: 'Carlos Ruiz', email: 'carlos@email.com', telefono: '+57 315 777 8888', rol: 'cliente' },
  ];

  abrirModalCrear() {
    this.editMode = false;
    this.currentUser = { nombre: '', email: '', telefono: '', rol: '' };
    this.showModal = true;
  }

  editarUsuario(user: any) {
    this.editMode = true;
    this.currentUser = { ...user };
    this.showModal = true;
  }

  eliminarUsuario(user: any) {
    if (confirm(`¿Eliminar usuario ${user.nombre}?`)) {
      this.users = this.users.filter(u => u.id !== user.id);
    }
  }

  guardarUsuario() {
    if (this.editMode) {
      const idx = this.users.findIndex(u => u.id === this.currentUser.id);
      if (idx !== -1) this.users[idx] = { ...this.currentUser };
    } else {
      const newId = Math.max(...this.users.map(u => u.id), 0) + 1;
      this.users.push({ ...this.currentUser, id: newId });
    }
    this.showModal = false;
  }

  cerrarModal() {
    this.showModal = false;
  }
}
