import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, NavbarComponent, FooterComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    handleReservationClick(event: Event) {
        event.preventDefault();

        if (!this.authService.isLogged()) {
            this.router.navigate(['/login']);
            return;
        }

        const role = this.authService.getRole()?.toUpperCase();

        if (role === 'CLIENTE') {
            this.router.navigate(['/cliente/my-reservations']);
        } else {
            Swal.fire({
                title: 'Acción no permitida',
                text: 'No hace parte de sus responsabilidades.',
                icon: 'warning',
                confirmButtonColor: '#bd1b5b'
            });
        }
    }
}
