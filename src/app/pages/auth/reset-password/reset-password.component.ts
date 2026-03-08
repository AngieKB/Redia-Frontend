import { Component, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink, Router, ActivatedRoute } from '@angular/router'
import { NavbarComponent } from '../../../shared/navbar/navbar.component'
import { FooterComponent } from '../../../shared/footer/footer.component'
import { AuthService } from '../../../core/services/auth.service'
import { AlertService } from '../../../core/services/alert.service'

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPassword {
    email = ''
    verificationCode = ''
    password = ''
    confirmPassword = ''
    loading = false
    showPassword = false
    showConfirmPassword = false

    errors = {
        verificationCode: '',
        password: '',
        confirmPassword: '',
        general: ''
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state) {
            this.email = navigation.extras.state['email'];
        }
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    resetPassword() {
        this.errors = { verificationCode: '', password: '', confirmPassword: '', general: '' };

        if (!this.email) {
            this.alertService.error('Falta el correo electrónico. Por favor, inicia el proceso de recuperación de nuevo.');
            this.router.navigate(['/recover-password']);
            return;
        }

        let hasError = false;

        if (!this.verificationCode || this.verificationCode.length !== 6) {
            this.errors.verificationCode = 'El código de verificación debe tener 6 caracteres.';
            hasError = true;
        }

        if (!this.password) {
            this.errors.password = 'La contraseña es requerida.';
            hasError = true;
        } else if (!this.isPasswordValid()) {
            this.errors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
            hasError = true;
        }

        if (this.password && this.confirmPassword && this.password !== this.confirmPassword) {
            this.errors.confirmPassword = 'Las contraseñas no coinciden.';
            hasError = true;
        }

        if (hasError) return;

        this.loading = true;

        const data = {
            email: this.email,
            verificationCode: this.verificationCode,
            newPassword: this.password
        };

        this.authService.resetPassword(data).subscribe({
            next: () => {
                this.loading = false;
                this.alertService.success('¡Contraseña restablecida exitosamente! Redirigiendo al inicio de sesión...');
                setTimeout(() => this.router.navigate(['/login']), 2000);
            },
            error: err => {
                this.loading = false;
                const msg = this.getBackendError(err, 'Error al restablecer la contraseña.');
                // Map message to specific field if possible
                const msgLower = msg.toLowerCase();
                if (msgLower.includes('código') || msgLower.includes('codigo') || msgLower.includes('verification') || msgLower.includes('inválido') || msgLower.includes('expirado')) {
                    this.errors.verificationCode = msg;
                } else if (msgLower.includes('contraseña') || msgLower.includes('password')) {
                    this.errors.password = msg;
                } else {
                    this.errors.general = msg;
                }
                this.cdr.detectChanges();
                console.error(err);
            }
        });
    }

    isPasswordValid(): boolean {
        const regex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/;
        return this.password.length >= 8 && regex.test(this.password);
    }

    private getBackendError(err: any, fallback: string): string {
        if (err.status === 0) return 'No se pudo conectar con el servidor. Verifica que el Backend esté encendido.'
        if (err.error?.message) return err.error.message
        if (err.error && typeof err.error === 'string') {
            try {
                const parsed = JSON.parse(err.error);
                if (parsed.message) return parsed.message;
            } catch (e) {
                return err.error;
            }
        }
        return fallback
    }
}
