import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { NavbarComponent } from '../../../shared/navbar/navbar.component'
import { FooterComponent } from '../../../shared/footer/footer.component'

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
    templateUrl: './privacy-policy.component.html',
    styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent {
    lastUpdated = 'Abril de 2026'
}
