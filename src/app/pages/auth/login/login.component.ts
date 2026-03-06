import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    email = ''
    password = ''

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    login() {

        const data = {
            email: this.email,
            password: this.password
        }

        this.authService.login(data).subscribe({
            next: (res: any) => {

                localStorage.setItem('accessToken', res.token)
                localStorage.setItem('refreshToken', res.refreshToken)
                localStorage.setItem('role', res.role)

                if (res.role === 'ADMINISTRADOR') {
                    this.router.navigate(['/admin'])
                } else {
                    this.router.navigate(['/dashboard'])
                }

            },
            error: err => {
                alert('Credenciales incorrectas')
                console.error(err)
            }
        })
    }

}