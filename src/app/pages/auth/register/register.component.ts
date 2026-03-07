import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Router } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'
import { AlertService } from '../../../core/services/alert.service'

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {

    nombre = ''
    email = ''
    password = ''
    role = 'CLIENTE' // Siempre será cliente

    constructor(
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService
    ) { }

    register() {

        const data = {
            nombre: this.nombre,
            email: this.email,
            password: this.password,
            role: 'CLIENTE' // Siempre CLIENTE
        }

        this.authService.register(data).subscribe({

            next: () => {
                // Auto login after successful registration
                this.authService.login({
                    email: this.email,
                    password: this.password
                }).subscribe({
                    next: (res: any) => {
                        localStorage.setItem('accessToken', res.token)
                        localStorage.setItem('refreshToken', res.refreshToken)
                        localStorage.setItem('role', res.role)
                        this.router.navigate(['/dashboard'])
                    },
                    error: err => {
                        this.alertService.error('User registered but login failed. Please login manually.')
                        this.router.navigate(['/login'])
                        console.error(err)
                    }
                })
            },

            error: err => {
                this.alertService.error('Registration error')
                console.error(err)
            }

        })

    }

}