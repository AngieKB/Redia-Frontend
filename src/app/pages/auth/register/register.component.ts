import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {

    nombre = ''
    email = ''
    password = ''
    role = 'CLIENTE'

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    register() {

        const data = {
            nombre: this.nombre,
            email: this.email,
            password: this.password,
            role: this.role
        }

        this.authService.register(data).subscribe({

            next: () => {
                alert('Usuario registrado')
                this.router.navigate(['/login'])
            },

            error: err => {
                alert('Error al registrar')
                console.error(err)
            }

        })

    }

}