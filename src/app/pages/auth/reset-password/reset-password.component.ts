import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink, Router } from '@angular/router'
import { NavbarComponent } from '../../../shared/navbar/navbar.component'
import { FooterComponent } from '../../../shared/footer/footer.component'
import { AlertService } from '../../../core/services/alert.service'

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPassword {
    password = ''
    confirmPassword = ''
    passwordError = ''

    constructor(
        private router: Router,
        private alertService: AlertService
    ) { }

    resetPassword() {
        this.passwordError = '';

        if (this.password !== this.confirmPassword) {
            this.passwordError = 'Las contraseñas no coinciden.';
            return;
        }

        if (this.password.length < 6) {
            this.passwordError = 'La contraseña debe tener al menos 6 caracteres.';
            return;
        }

        // Call service to reset password here
        this.alertService.success('Contraseña actualizada correctamente!');
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 1500);
    }
}
