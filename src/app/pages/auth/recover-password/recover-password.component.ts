import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../../core/services/auth.service'

@Component({
    selector: 'app-recover-password',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {

    email = ''
    nuevaPassword = ''

    constructor(private authService: AuthService) { }

    recover() {

        const data = {
            email: this.email,
            nuevaPassword: this.nuevaPassword
        }

        this.authService.recoverPassword(data).subscribe({

            next: () => {
                alert('Contraseña actualizada')
            },

            error: err => {
                alert('Error al actualizar contraseña')
                console.error(err)
            }

        })

    }

}