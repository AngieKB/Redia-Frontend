import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Router } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'
import { AlertService } from '../../../core/services/alert.service'
import { NavbarComponent } from '../../../shared/navbar/navbar.component'
import { FooterComponent } from '../../../shared/footer/footer.component'

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    email = ''
    password = ''

    constructor(
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService
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
                this.alertService.error('Incorrect credentials')
                console.error(err)
            }
        })
    }

}