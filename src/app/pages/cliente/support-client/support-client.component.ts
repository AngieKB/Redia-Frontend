import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NavbarComponent } from '../../../shared/navbar/navbar.component'
import { AlertService } from '../../../core/services/alert.service'

@Component({
    selector: 'app-support-client',
    standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent],
    templateUrl: './support-client.component.html',
    styleUrls: ['./support-client.component.css']
})
export class SupportClientComponent {

    asunto = ''
    mensaje = ''

    constructor(private alertService: AlertService) { }

    sendMessage() {
        if (!this.asunto.trim() || !this.mensaje.trim()) {
            this.alertService.error('Por favor completa todos los campos para enviar tu mensaje.')
            return
        }

        // In a real app this would call a support endpoint
        // this.supportService.sendMessage(...)

        this.alertService.success('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.')
        this.asunto = ''
        this.mensaje = ''
    }
}
