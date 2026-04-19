import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { NavbarComponent } from '../../../shared/navbar/navbar.component'
import { FooterComponent } from '../../../shared/footer/footer.component'
import { AuthService } from '../../../core/services/auth.service'
import Swal from 'sweetalert2'

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
    templateUrl: './privacy-policy.component.html',
    styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent {
    lastUpdated = 'Abril de 2026'

    constructor(private authService: AuthService, private router: Router) {}

    requestDeletion() {
        if (!this.authService.isLogged()) {
            Swal.fire({
                title: 'Inicia sesión',
                text: 'Para darte de baja necesitas iniciar sesión con la cuenta que deseas eliminar.',
                icon: 'info',
                confirmButtonColor: '#bd1b5b'
            }).then(() => {
                this.router.navigate(['/login']);
            });
            return;
        }

        Swal.fire({
            title: '¿Solicitar baja de cuenta?',
            text: 'Esta acción notificará al equipo de administración para eliminar definitivamente tus datos. Ya no podrás acceder a tu historial.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e53935',
            cancelButtonColor: '#888',
            confirmButtonText: 'Sí, dar de baja',
            cancelButtonText: 'Cancelar'
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.authService.requestDeletion().subscribe({
                    next: (res) => {
                        Swal.fire({
                            title: 'Solicitud enviada',
                            text: 'Hemos recibido tu solicitud de baja de cuenta. Se procesará en breve.',
                            icon: 'success',
                            confirmButtonColor: '#bd1b5b'
                        });
                        // Opcional: Cerrar sesión después de solicitar la baja
                        // this.authService.logout();
                        // this.router.navigate(['/']);
                    },
                    error: (err) => {
                        Swal.fire('Error', 'No se pudo procesar tu solicitud. Intenta de nuevo.', 'error');
                    }
                });
            }
        });
    }
}
