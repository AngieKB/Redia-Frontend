import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePage {
  editMode = false;
  passwordMode = false;

  user = {
    nombre: 'María García',
    email: 'maria@email.com',
    telefono: '+57 320 555 6666',
    rol: 'cliente'
  };

  editUser = { ...this.user };

  passwords = { actual: '', nueva: '', confirmar: '' };

  editarDatos() {
    this.editUser = { ...this.user };
    this.editMode = true;
    this.passwordMode = false;
  }

  cancelarEdicion() {
    this.editMode = false;
  }

  guardarCambios() {
    this.user = { ...this.editUser };
    this.editMode = false;
  }

  cambiarContrasena() {
    this.passwords = { actual: '', nueva: '', confirmar: '' };
    this.passwordMode = true;
    this.editMode = false;
  }

  cancelarContrasena() {
    this.passwordMode = false;
  }

  guardarContrasena() {
    if (this.passwords.nueva !== this.passwords.confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Contraseña actualizada');
    this.passwordMode = false;
  }
}
