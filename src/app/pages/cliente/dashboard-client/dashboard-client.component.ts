import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard-client.component.html',
    styleUrls: ['./dashboard-client.component.css']
})
export class DashboardClientComponent {

    constructor(private router: Router) { }

    logout() {
        localStorage.clear()
        this.router.navigate(['/login'])
    }

}
