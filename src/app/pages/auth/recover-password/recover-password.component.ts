import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Router } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'
import { AlertService } from '../../../core/services/alert.service'

@Component({
    selector: 'app-recover-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
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

    constructor(
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService
    ) { }

    requestCode() {
        this.loading = true

        this.authService.requestPasswordReset(this.email).subscribe({
            next: (res: any) => {
                this.loading = false
                this.codeSent = true
                this.alertService.success('¡Código de verificación enviado a tu correo! Expira en 10 minutos.')
                setTimeout(() => {
                    this.showNewPasswordForm = true
                }, 2000)
            },
            error: err => {
                this.loading = false
                const msg = this.getBackendError(err, 'Error al enviar el código. Verifica que el correo está registrado.')
                this.alertService.error(msg)
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
                setTimeout(() => this.router.navigate(['/login']), 2000)
            },
            error: err => {
                this.loading = false
                const msg = this.getBackendError(err, 'Error al restablecer la contraseña.')
                this.alertService.error(msg)
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
        if (err.error && typeof err.error === 'string') return err.error
        if (err.error?.message) return err.error.message
        return fallback
    }

}