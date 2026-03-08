import { Component, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Router } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'
import { AlertService } from '../../../core/services/alert.service'
import { NavbarComponent } from '../../../shared/navbar/navbar.component'
import { FooterComponent } from '../../../shared/footer/footer.component'
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha'

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent, RecaptchaModule, RecaptchaFormsModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {

    nombre = ''
    email = ''
    telefono = ''
    password = ''
    confirmPassword = ''
    showPassword = false
    showConfirmPassword = false
    passwordError = ''
    errorMessage = ''
    errors = {
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: ''
    }
    role = 'CLIENTE'
    foto?: File
    recaptchaToken: string | null = null;
    recaptchaError = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) { }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    onFileSelected(event: any) {
        this.foto = event.target.files[0]
    }

    soloNumeros(event: KeyboardEvent): boolean {
        const char = event.key;
        // Allow control keys (backspace, tab, arrows, etc)
        if (char.length > 1) return true;
        return /[0-9]/.test(char);
    }

    pegadoNumeros(event: ClipboardEvent) {
        const texto = event.clipboardData?.getData('text') ?? '';
        if (!/^\d+$/.test(texto)) {
            event.preventDefault();
        }
    }

    register() {
        this.passwordError = '';
        this.errorMessage = '';
        this.recaptchaError = '';
        this.errors = { nombre: '', email: '', telefono: '', password: '', confirmPassword: '' };

        let hasError = false;

        if (!this.recaptchaToken) {
            this.recaptchaError = 'Por favor, resuelve el reCAPTCHA.';
            hasError = true;
        }

        if (!this.nombre.trim()) {
            this.errors.nombre = 'El nombre es requerido.';
            hasError = true;
        }
        if (!this.email.trim()) {
            this.errors.email = 'El correo es requerido.';
            hasError = true;
        } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(this.email.trim())) {
            this.errors.email = 'Debe ser un correo electrónico válido.';
            hasError = true;
        }
        if (!this.telefono.trim()) {
            this.errors.telefono = 'El teléfono es requerido.';
            hasError = true;
        } else if (!/^\d{10}$/.test(this.telefono.trim())) {
            this.errors.telefono = 'El teléfono debe tener exactamente 10 dígitos.';
            hasError = true;
        }
        if (!this.password) {
            this.errors.password = 'La contraseña es requerida.';
            hasError = true;
        } else if (this.password.length < 8) {
            this.errors.password = 'La contraseña debe tener al menos 8 caracteres.';
            hasError = true;
        } else if (!/[A-Z]/.test(this.password)) {
            this.errors.password = 'La contraseña debe contener al menos una letra mayúscula.';
            hasError = true;
        } else if (!/[a-z]/.test(this.password)) {
            this.errors.password = 'La contraseña debe contener al menos una letra minúscula.';
            hasError = true;
        } else if (!/[0-9]/.test(this.password)) {
            this.errors.password = 'La contraseña debe contener al menos un número.';
            hasError = true;
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.password)) {
            this.errors.password = 'La contraseña debe contener al menos un carácter especial (!@#$%...).';
            hasError = true;
        }

        if (this.password !== this.confirmPassword) {
            this.errors.confirmPassword = 'Las contraseñas no coinciden.';
            hasError = true;
        }

        if (hasError) return;

        const data = {
            nombre: this.nombre,
            email: this.email,
            telefono: this.telefono,
            password: this.password,
            role: this.role,
            recaptchaToken: this.recaptchaToken as string,
            fotoUrl: this.foto
        }

        this.authService.register(data).subscribe({

            next: () => {
                this.alertService.success('¡Usuario registrado exitosamente!')
                this.router.navigate(['/login'])
            },

            error: err => {
                console.error('Registration Error:', err)
                const msg = this.getBackendError(err, 'Hubo un error al registrar el usuario.')

                // Map backend errors to specific fields if possible
                const msgLower = msg.toLowerCase()
                if (msgLower.includes('correo')) {
                    this.errors.email = msg
                } else if (msgLower.includes('teléfono') || msgLower.includes('telefono')) {
                    this.errors.telefono = msg
                } else if (msgLower.includes('nombre')) {
                    this.errors.nombre = msg
                } else if (msgLower.includes('contraseña') || msgLower.includes('password')) {
                    this.errors.password = msg
                } else {
                    this.errorMessage = msg
                }

                // Force UI to update immediately
                this.cdr.detectChanges()
            }

        })

    }

    onCaptchaResolved(captchaResponse: string | null) {
        this.recaptchaToken = captchaResponse;
        this.recaptchaError = '';
    }

    private getBackendError(err: any, fallback: string): string {
        if (err.status === 0) return 'No se pudo conectar con el servidor. Verifica que el Backend esté encendido.'
        if (err.error?.message) return err.error.message
        if (err.error && typeof err.error === 'string') return err.error
        return fallback
    }

}