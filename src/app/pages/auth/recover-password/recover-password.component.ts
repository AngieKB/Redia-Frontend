import { Component, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Router } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'
import { AlertService } from '../../../core/services/alert.service'
import { RecaptchaModule, RecaptchaFormsModule } from '../../../shared/recaptcha/recaptcha.module'

@Component({
    selector: 'app-recover-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, RecaptchaModule, RecaptchaFormsModule],
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {

    email = ''
    verificationCode = ''
    newPassword = ''
    confirmPassword = ''
    loading = false
    codeSent = false
    showNewPasswordForm = false
    recaptchaToken: string | null = null;
    recaptchaError = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) { }

    onCaptchaResolved(captchaResponse: string | null) {
        this.recaptchaToken = captchaResponse;
        this.recaptchaError = '';
    }

    requestCode() {
        this.recaptchaError = ''

        if (!this.email.trim()) {
            this.alertService.warning('El correo es requerido.')
            return
        }

        if (!this.recaptchaToken) {
            this.recaptchaError = 'Por favor, resuelve el reCAPTCHA.'
            return
        }

        this.loading = true

        this.authService.requestPasswordReset(this.email, this.recaptchaToken).subscribe({
            next: (res: any) => {
                this.loading = false
                this.codeSent = true
                this.alertService.success('¡Código de verificación enviado a tu correo! Expira en 10 minutos.')
                this.cdr.detectChanges()

                setTimeout(() => {
                    this.router.navigate(['/reset-password'], { state: { email: this.email } })
                }, 1500)
            },
            error: err => {
                this.loading = false
                const msg = this.getBackendError(err, 'Error al enviar el código. Verifica que el correo está registrado.')
                this.alertService.error(msg)
                this.cdr.detectChanges()
                console.error(err)
            }
        })
    }

    resetPassword() {
        if (!this.isPasswordValid()) {
            this.alertService.warning('Las contraseñas no coinciden o son muy cortas (mínimo 6 caracteres).')
            return
        }

        this.loading = true

        const data = {
            email: this.email,
            verificationCode: this.verificationCode,
            newPassword: this.newPassword
        }

        this.authService.resetPassword(data).subscribe({
            next: () => {
                this.loading = false
                this.alertService.success('¡Contraseña restablecida exitosamente! Redirigiendo al inicio de sesión...')
                this.cdr.detectChanges()
                setTimeout(() => this.router.navigate(['/login']), 2000)
            },
            error: err => {
                this.loading = false
                const msg = this.getBackendError(err, 'Error al restablecer la contraseña.')
                this.alertService.error(msg)
                this.cdr.detectChanges()
                console.error(err)
            }
        })
    }

    isPasswordValid(): boolean {
        return !!(this.newPassword &&
            this.confirmPassword &&
            this.newPassword === this.confirmPassword &&
            this.newPassword.length >= 6)
    }

    goBack() {
        this.showNewPasswordForm = false
        this.codeSent = false
        this.verificationCode = ''
        this.newPassword = ''
        this.confirmPassword = ''
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