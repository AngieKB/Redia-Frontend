import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

// Mesas predeterminadas del restaurante (fijas)
// Mesas 1,2,9,10 = 2 personas | Mesas 3,4,5,6,7,8 = 4 personas
const MESAS_PREDETERMINADAS = [
    { id: '1', nombre: '1', capacidad: 2 },
    { id: '2', nombre: '2', capacidad: 2 },
    { id: '3', nombre: '3', capacidad: 4 },
    { id: '4', nombre: '4', capacidad: 4 },
    { id: '5', nombre: '5', capacidad: 4 },
    { id: '6', nombre: '6', capacidad: 4 },
    { id: '7', nombre: '7', capacidad: 4 },
    { id: '8', nombre: '8', capacidad: 4 },
    { id: '9', nombre: '9', capacidad: 2 },
    { id: '10', nombre: '10', capacidad: 2 },
];

@Component({
    selector: 'app-tables',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
    templateUrl: './tables.component.html',
    styleUrl: './tables.component.css',
})
export class TablesComponent implements OnInit {
    tables = MESAS_PREDETERMINADAS;

    ngOnInit() { }
}
