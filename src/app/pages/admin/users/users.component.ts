import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { RecaptchaModule, RecaptchaFormsModule } from '../../../shared/recaptcha/recaptcha.module';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent, RecaptchaModule, RecaptchaFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class Users implements OnInit {
  showModal = false;

  // Note: Backend requires a password on creation. Edit is not supported by backend currently.
  currentUser: any = { nombre: '', email: '', password: '', telefono: '', role: '' };
  showPassword = false;
  recaptchaToken: string | null = null;

  users: User[] = [];
  searchTerm = '';
  selectedRole = '';
  isLoading = false;
  errorMessage = '';
  errors: { [key: string]: string } = {};
  isSaving = false;
  
  // Tabs "normal" | "bajas"
  activeTab: 'normal' | 'bajas' = 'normal';

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
        const currentEmail = localStorage.getItem('email');
        this.users = data.filter(u => u.email !== currentEmail);
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

  get filteredNormalUsers(): User[] {
    return this.users.filter(u => {
      const matchSearch = u.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchRole = this.selectedRole ? u.role === this.selectedRole : true;
      return matchSearch && matchRole && !u.bajaSolicitada;
    });
  }

  get filteredUnsubscribingUsers(): User[] {
    return this.users.filter(u => {
      const matchSearch = u.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchRole = this.selectedRole ? u.role === this.selectedRole : true;
      return matchSearch && matchRole && u.bajaSolicitada;
    });
  }

  abrirModalCrear() {
    this.currentUser = { nombre: '', email: '', password: '', telefono: '', role: '' };
    this.errorMessage = '';
    this.errors = {};
    this.recaptchaToken = null;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.errorMessage = '';
    this.errors = {};
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onCaptchaResolved(captchaResponse: string | null) {
    this.recaptchaToken = captchaResponse;
    if (captchaResponse) {
      delete this.errors['recaptcha'];
    }
  }

  guardarUsuario() {
    this.errorMessage = '';
    this.errors = {};
    let isValid = true;

    if (!this.currentUser.nombre) { this.errors['nombre'] = 'El nombre es obligatorio.'; isValid = false; }
    if (!this.currentUser.email) { this.errors['email'] = 'El correo es obligatorio.'; isValid = false; }
    if (!this.currentUser.password) { this.errors['password'] = 'La contraseña es obligatoria.'; isValid = false; }
    if (!this.currentUser.role) { this.errors['role'] = 'El rol es obligatorio.'; isValid = false; }

    if (this.currentUser.telefono && !/^[0-9]+$/.test(this.currentUser.telefono)) {
      this.errors['telefono'] = 'El teléfono solo debe contener números.';
      isValid = false;
    }

    if (this.currentUser.password) {
      const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/;
      if (this.currentUser.password.length < 8 || !passwordRegex.test(this.currentUser.password)) {
        this.errors['password'] = 'Mínimo 8 caracteres, mayúscula, número y símbolo.';
        isValid = false;
      }
    }

    if (!this.recaptchaToken) {
      this.errors['recaptcha'] = 'Por favor, resuelve el reCAPTCHA.';
      isValid = false;
    }

    if (!isValid) return;

    this.isSaving = true;

    // Backend requires FormData with form-url-encoded fields due to @RequestParam
    const formData = new FormData();
    formData.append('nombre', this.currentUser.nombre);
    formData.append('email', this.currentUser.email);
    formData.append('password', this.currentUser.password);
    formData.append('telefono', this.currentUser.telefono || '');
    formData.append('role', this.currentUser.role);
    if (this.recaptchaToken) {
      formData.append('recaptchaToken', this.recaptchaToken);
    }

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
            this.users = this.users.filter(u => u.id !== user.id);
            this.cdr.detectChanges();
            this.loadUsers();
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
            Swal.fire('Error', this.errorMessage, 'error');
          }
        });
      }
    });
  }

}
