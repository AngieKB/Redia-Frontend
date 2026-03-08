import { Component } from '@angular/core'
import { CommonModule, Location } from '@angular/common'
import { NavbarComponent } from '../../../shared/navbar/navbar.component'
import { AlertService } from '../../../core/services/alert.service'

@Component({
    selector: 'app-support-client',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    templateUrl: './support-client.component.html',
    styleUrls: ['./support-client.component.css']
})
export class SupportClientComponent {
    constructor(private location: Location) { }

    goBack() {
        this.location.back();
    }
}
