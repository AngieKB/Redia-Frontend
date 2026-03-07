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
                setTimeout(() => {
                    this.showNewPasswordForm = true
                }, 2000)
            },
            error: err => {
                this.loading = false
                this.alertService.error('Error sending code. Verify email is registered.')
                console.error(err)
            }
        })
    }

    resetPassword() {
        if (!this.isPasswordValid()) {
            this.alertService.warning('Passwords do not match')
            return
        }

        this.loading = true
        
        const data = {
            email: this.email,
            code: this.verificationCode,
            newPassword: this.newPassword
        }

        this.authService.resetPassword(data).subscribe({
            next: () => {
                this.loading = false
                this.alertService.success('Password reset successfully')
                this.router.navigate(['/login'])
            },
            error: err => {
                this.loading = false
                if (err.status === 400) {
                    this.alertService.warning('Invalid or expired code. Request a new code.')
                } else {
                    this.alertService.error('Password reset error')
                }
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

}