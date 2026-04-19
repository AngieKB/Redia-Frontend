import { Component, ChangeDetectorRef, OnInit, NgZone } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Router } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'
import { AlertService } from '../../../core/services/alert.service'
import { NavbarComponent } from '../../../shared/navbar/navbar.component'
import { FooterComponent } from '../../../shared/footer/footer.component'
import { AuthResponse } from '../../../models/auth.model'
import { RecaptchaModule, RecaptchaFormsModule } from '../../../shared/recaptcha/recaptcha.module'

declare var google: any;

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent, RecaptchaModule, RecaptchaFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    email = ''
    password = ''
    showPassword = false
    errorMessage = ''
    errors = {
        email: '',
        password: ''
    }

    // 2FA state
    requiresTwoFactor = false
    twoFactorEmail = ''
    twoFactorCode = ''
    twoFactorError = ''
    twoFactorLoading = false

    constructor(
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) { }

    ngOnInit() {
        this.initializeGoogleSignIn();
    }

    initializeGoogleSignIn() {
        if (typeof google === 'undefined') {
            setTimeout(() => this.initializeGoogleSignIn(), 100);
            return;
        }

        const buttonDiv = document.getElementById("google-buttonDiv");
        if (!buttonDiv) {
            setTimeout(() => this.initializeGoogleSignIn(), 100);
            return;
        }

        google.accounts.id.initialize({
            client_id: '115728163825-koff0lsutk5h271dlck8s23rnt37sq42.apps.googleusercontent.com',
            callback: this.handleGoogleCredentialResponse.bind(this)
        });

        google.accounts.id.renderButton(
            buttonDiv,
            { theme: "outline", size: "large", width: 350, text: "continue_with" }
        );
    }

    handleGoogleCredentialResponse(response: any) {
        if (response.credential) {
            this.ngZone.run(() => {
                this.authService.googleLogin(response.credential).subscribe({
                    next: (res: any) => {

                        if (res.requiresTwoFactor) {
                            this.requiresTwoFactor = true;
                            this.twoFactorEmail = res.email;
                            this.cdr.detectChanges();
                            return;
                        }

                        localStorage.setItem('accessToken', res.accessToken)
                        localStorage.setItem('refreshToken', res.refreshToken)
                        localStorage.setItem('role', res.role)
                        localStorage.setItem('email', res.email)
                        if (res.nombre) localStorage.setItem('nombre', res.nombre)
                        if (res.telefono) localStorage.setItem('telefono', res.telefono)
                        if (res.fotoUrl) localStorage.setItem('fotoUrl', res.fotoUrl)

                        // If phone is missing, profile is incomplete
                        if (!res.telefono || res.telefono.trim() === '') {
                            this.router.navigate(['/complete-google-profile'])
                        } else {
                            // Profile is complete, go to dashboard
                            if (res.role === 'ADMINISTRADOR') {
                                this.router.navigate(['/admin/dashboard'])
                            } else if (res.role === 'RECEPCIONISTA') {
                                this.router.navigate(['/recepcionista/dashboard'])
                            } else if (res.role === 'MESERO') {
                                this.router.navigate(['/mesero/dashboard'])
                            } else if (res.role === 'COCINERO') {
                                this.router.navigate(['/cocinero/dashboard'])
                            } else if (res.role === 'CAJERO') {
                                this.router.navigate(['/cajero/dashboard'])
                            } else {
                                this.router.navigate(['/cliente/my-reservations'])
                            }
                        }
                    },
                    error: (err) => {
                        this.errorMessage = this.getBackendError(err, 'Error iniciando sesión con Google')
                        this.cdr.detectChanges()
                        console.error('Error Google Login:', err)
                    }
                })
            })
        }
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    login() {
        this.errorMessage = ''
        this.errors = { email: '', password: '' }

        let hasError = false;

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
            password: this.password
        }

        this.authService.login(data).subscribe({
            next: (res: AuthResponse) => {

                // If 2FA is required, show the 2FA screen
                if (res.requiresTwoFactor) {
                    this.requiresTwoFactor = true;
                    this.twoFactorEmail = res.email;
                    this.cdr.detectChanges();
                    return;
                }

                this.completeLogin(res);

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

    submitTwoFactorCode() {
        this.twoFactorError = ''
        const code = parseInt(this.twoFactorCode, 10);

        if (!this.twoFactorCode || isNaN(code)) {
            this.twoFactorError = 'Introduce un código válido de 6 dígitos.';
            return;
        }

        this.twoFactorLoading = true;
        this.authService.verifyTwoFactor(this.twoFactorEmail, code).subscribe({
            next: (res: AuthResponse) => {
                this.twoFactorLoading = false;
                this.completeLogin(res);
            },
            error: err => {
                this.twoFactorLoading = false;
                this.twoFactorError = this.getBackendError(err, 'Código incorrecto o expirado. Inténtalo de nuevo.');
                this.cdr.detectChanges();
            }
        });
    }

    private completeLogin(res: AuthResponse) {
        localStorage.setItem('accessToken', res.accessToken)
        localStorage.setItem('refreshToken', res.refreshToken)
        localStorage.setItem('role', res.role)
        localStorage.setItem('email', res.email)
        if (res.nombre) localStorage.setItem('nombre', res.nombre)
        if (res.telefono) localStorage.setItem('telefono', res.telefono)
        if (res.fotoUrl) localStorage.setItem('fotoUrl', res.fotoUrl)

        if (res.role === 'ADMINISTRADOR') {
            this.router.navigate(['/admin/dashboard'])
        } else if (res.role === 'RECEPCIONISTA') {
            this.router.navigate(['/recepcionista/dashboard'])
        } else if (res.role === 'MESERO') {
            this.router.navigate(['/mesero/dashboard'])
        } else if (res.role === 'COCINERO') {
            this.router.navigate(['/cocinero/dashboard'])
        } else if (res.role === 'CAJERO') {
            this.router.navigate(['/cajero/dashboard'])
        } else {
            this.router.navigate(['/cliente/my-reservations'])
        }
    }

    private getBackendError(err: any, fallback: string): string {
        if (err.status === 0) return 'No se pudo conectar con el servidor. Verifica que el Backend esté encendido.'

        if (err.status === 401 || err.status === 403) {
            return 'Credenciales incorrectas. Verifica tu correo y contraseña.'
        }

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