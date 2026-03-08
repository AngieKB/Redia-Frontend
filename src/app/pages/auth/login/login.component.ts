import { Component, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Router } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'
import { AlertService } from '../../../core/services/alert.service'
import { NavbarComponent } from '../../../shared/navbar/navbar.component'
import { FooterComponent } from '../../../shared/footer/footer.component'
import { AuthResponse } from '../../../models/auth.model'
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha'

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent, RecaptchaModule, RecaptchaFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    email = ''
    password = ''
    showPassword = false
    errorMessage = ''
    errors = {
        email: '',
        password: ''
    }
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

    login() {
        this.errorMessage = ''
        this.recaptchaError = ''
        this.errors = { email: '', password: '' }

        let hasError = false;

        if (!this.recaptchaToken) {
            this.recaptchaError = 'Por favor, resuelve el reCAPTCHA.';
            hasError = true;
        }

        if (!this.email.trim()) {
            this.errors.email = 'El correo electrónico es requerido.'
            hasError = true;
        } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(this.email.trim())) {
            this.errors.email = 'Debe ser un correo electrónico válido.'
            hasError = true;
        }
        if (!this.password) {
            this.errors.password = 'La contraseña es requerida.'
            hasError = true;
        }

        if (hasError) return;

        const data = {
            email: this.email,
            password: this.password,
            recaptchaToken: this.recaptchaToken as string
        }

        this.authService.login(data).subscribe({
            next: (res: AuthResponse) => {

                localStorage.setItem('accessToken', res.accessToken)
                localStorage.setItem('refreshToken', res.refreshToken)
                localStorage.setItem('role', res.role)
                localStorage.setItem('email', res.email)

                if (res.role === 'ADMINISTRADOR') {
                    this.router.navigate(['/admin/dashboard'])
                } else if (res.role === 'RECEPCIONISTA') {
                    this.router.navigate(['/recepcionista/dashboard'])
                } else {
                    this.router.navigate(['/dashboard'])
                }

            },
            error: err => {
                const msg = this.getBackendError(err, 'Credenciales incorrectas. Verifica tu correo y contraseña.')
                const msgLower = msg.toLowerCase()

                if (msgLower.includes('correo') || msgLower.includes('email')) {
                    this.errors.email = msg
                } else if (msgLower.includes('contraseña') || msgLower.includes('password') || msgLower.includes('credenciales')) {
                    this.errorMessage = msg
                } else {
                    this.errorMessage = msg
                }

                // Force UI to update immediately
                this.cdr.detectChanges()
                console.error(err)
            }
        })
    }

    onCaptchaResolved(captchaResponse: string | null) {
        this.recaptchaToken = captchaResponse;
        this.recaptchaError = '';
    }

    private getBackendError(err: any, fallback: string): string {
        if (err.status === 0) return 'No se pudo conectar con el servidor. Verifica que el Backend esté encendido.'

        if (err.status === 401 || err.status === 403) {
            return 'Credenciales incorrectas. Verifica tu correo y contraseña.'
        }

        if (err.error?.message) return err.error.message
        if (err.error && typeof err.error === 'string') return err.error

        return fallback
    }

}