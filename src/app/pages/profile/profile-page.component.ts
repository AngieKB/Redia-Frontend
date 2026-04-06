import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AlertService } from '../../core/services/alert.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePage implements OnInit {
  editMode = false;
  passwordMode = false;
  savingPassword = false;

  showPasswordActual = false;
  showPasswordNueva = false;
  showPasswordConfirmar = false;

  user = {
    nombre: '',
    email: '',
    telefono: '',
    rol: '',
    fotoUrl: ''
  };

  editUser = { ...this.user };
  newFotoFile: File | null = null;
  newFotoPreview: string = '';

  editErrors = {
    nombre: '',
    telefono: ''
  };

  passwords = { actual: '', nueva: '', confirmar: '' };

  passwordErrors = {
    actual: '',
    nueva: '',
    confirmar: ''
  };

  // 2FA state
  twoFactorEnabled = false;
  twoFactorSetupMode = false;
  twoFactorQrUrl = '';
  twoFactorSecret = '';
  twoFactorConfirmCode = '';
  twoFactorConfirmError = '';
  twoFactorLoading = false;
  twoFactorSuccessMsg = '';

  constructor(
    private location: Location,
    private alertService: AlertService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.user.nombre = localStorage.getItem('nombre') || '';
    this.user.email = localStorage.getItem('email') || '';
    this.user.telefono = localStorage.getItem('telefono') || '';
    this.user.rol = localStorage.getItem('role') || 'CLIENTE';
    this.user.fotoUrl = localStorage.getItem('fotoUrl') || '';
    this.editUser = { ...this.user };
    this.twoFactorEnabled = localStorage.getItem('twoFactorEnabled') === 'true';
  }

  goBack() {
    this.location.back();
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('nombre');
    localStorage.removeItem('email');
    localStorage.removeItem('telefono');
    localStorage.removeItem('fotoUrl');
    this.router.navigate(['/login']);
  }

  editarDatos() {
    this.editUser = { ...this.user };
    this.editErrors = { nombre: '', telefono: '' };
    this.newFotoFile = null;
    this.newFotoPreview = '';
    this.editMode = true;
    this.passwordMode = false;
  }

  cancelarEdicion() {
    this.editMode = false;
    this.newFotoFile = null;
    this.newFotoPreview = '';
  }

  soloNumeros(event: KeyboardEvent): boolean {
    const char = event.key;
    if (char.length > 1) return true;
    return /[0-9]/.test(char);
  }

  pegadoNumeros(event: ClipboardEvent) {
    const texto = event.clipboardData?.getData('text') ?? '';
    if (!/^\d+$/.test(texto)) {
      event.preventDefault();
    }
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

  guardarCambios() {
    this.editErrors = { nombre: '', telefono: '' };
    let hasError = false;

    if (!this.editUser.nombre.trim()) {
      this.editErrors.nombre = 'El nombre es requerido.';
      hasError = true;
    }

    if (!this.editUser.telefono.trim()) {
      this.editErrors.telefono = 'El teléfono es requerido.';
      hasError = true;
    } else if (!/^\d{10}$/.test(this.editUser.telefono.trim())) {
      this.editErrors.telefono = 'El teléfono debe tener exactamente 10 dígitos.';
      hasError = true;
    }

    if (hasError) return;

    this.user = { ...this.editUser };
    localStorage.setItem('nombre', this.user.nombre);
    localStorage.setItem('telefono', this.user.telefono);

    // If a new photo was selected, save it as base64 (preview) locally.
    // In a full implementation this would upload to the backend.
    if (this.newFotoPreview) {
      this.user.fotoUrl = this.newFotoPreview;
      localStorage.setItem('fotoUrl', this.newFotoPreview);
    }

    this.alertService.success('Datos actualizados correctamente.');
    this.editMode = false;
    this.newFotoFile = null;
    this.newFotoPreview = '';
  }

  cambiarContrasena() {
    this.passwords = { actual: '', nueva: '', confirmar: '' };
    this.passwordErrors = { actual: '', nueva: '', confirmar: '' };
    this.passwordMode = true;
    this.editMode = false;
  }

  cancelarContrasena() {
    this.passwordMode = false;
  }

  isPasswordValid(password: string): boolean {
    const regex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/;
    return password.length >= 8 && regex.test(password);
  }

  guardarContrasena() {
    this.passwordErrors = { actual: '', nueva: '', confirmar: '' };
    let hasError = false;

    if (!this.passwords.actual) {
      this.passwordErrors.actual = 'La contraseña actual es requerida.';
      hasError = true;
    }

    if (!this.passwords.nueva) {
      this.passwordErrors.nueva = 'La nueva contraseña es requerida.';
      hasError = true;
    } else if (!this.isPasswordValid(this.passwords.nueva)) {
      this.passwordErrors.nueva = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
      hasError = true;
    } else if (this.passwords.nueva === this.passwords.actual) {
      this.passwordErrors.nueva = 'La nueva contraseña no puede ser igual a la contraseña actual.';
      hasError = true;
    }

    if (this.passwords.nueva && this.passwords.confirmar && this.passwords.nueva !== this.passwords.confirmar) {
      this.passwordErrors.confirmar = 'Las contraseñas no coinciden.';
      hasError = true;
    }

    if (hasError) return;

    this.savingPassword = true;

    this.authService.changePassword({
      oldPassword: this.passwords.actual,
      newPassword: this.passwords.nueva
    }).subscribe({
      next: () => {
        this.savingPassword = false;
        this.alertService.success('Contraseña actualizada correctamente.');
        this.passwordMode = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.savingPassword = false;
        const msg = this.getBackendError(err, 'Error al cambiar la contraseña.');
        const msgLower = msg.toLowerCase();
        if (msgLower.includes('actual') || msgLower.includes('antigua') || msgLower.includes('incorrecta') || msgLower.includes('wrong') || msgLower.includes('old')) {
          this.passwordErrors.actual = msg;
        } else {
          this.passwordErrors.nueva = msg;
        }
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  private getBackendError(err: any, fallback: string): string {
    if (err.status === 0) return 'No se pudo conectar con el servidor.';
    if (err.error?.message) return err.error.message;
    if (err.error && typeof err.error === 'string') {
      try {
        const parsed = JSON.parse(err.error);
        if (parsed.message) return parsed.message;
      } catch (e) {
        return err.error;
      }
    }
    return fallback;
  }

  // 2FA Methods
  setup2FA() {
    this.twoFactorLoading = true;
    this.twoFactorConfirmError = '';
    this.twoFactorSuccessMsg = '';
    this.authService.setup2FA().subscribe({
      next: (res) => {
        this.twoFactorLoading = false;
        this.twoFactorQrUrl = res.qrCodeUrl;
        this.twoFactorSecret = res.secret;
        this.twoFactorSetupMode = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.twoFactorLoading = false;
        this.twoFactorConfirmError = this.getBackendError(err, 'Error al iniciar la configuración 2FA.');
        this.cdr.detectChanges();
      }
    });
  }

  enable2FA() {
    const code = parseInt(this.twoFactorConfirmCode, 10);
    if (!this.twoFactorConfirmCode || isNaN(code)) {
      this.twoFactorConfirmError = 'Introduce el código de 6 dígitos de la app.';
      return;
    }
    this.twoFactorLoading = true;
    this.twoFactorConfirmError = '';
    this.authService.enable2FA(code).subscribe({
      next: () => {
        this.twoFactorLoading = false;
        this.twoFactorEnabled = true;
        this.twoFactorSetupMode = false;
        this.twoFactorQrUrl = '';
        this.twoFactorConfirmCode = '';
        localStorage.setItem('twoFactorEnabled', 'true');
        this.twoFactorSuccessMsg = '¡Verificación de dos pasos activada exitosamente!';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.twoFactorLoading = false;
        this.twoFactorConfirmError = this.getBackendError(err, 'Código incorrecto. Inténtalo de nuevo.');
        this.cdr.detectChanges();
      }
    });
  }

  disable2FA() {
    if (!confirm('¿Estás seguro de que deseas desactivar la verificación de dos pasos?')) return;
    this.twoFactorLoading = true;
    this.authService.disable2FA().subscribe({
      next: () => {
        this.twoFactorLoading = false;
        this.twoFactorEnabled = false;
        this.twoFactorSetupMode = false;
        localStorage.setItem('twoFactorEnabled', 'false');
        this.twoFactorSuccessMsg = 'Verificación de dos pasos desactivada.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.twoFactorLoading = false;
        this.twoFactorConfirmError = this.getBackendError(err, 'Error al desactivar el 2FA.');
        this.cdr.detectChanges();
      }
    });
  }
}
