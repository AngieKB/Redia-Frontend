import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { NavbarComponent } from '../../../shared/navbar/navbar.component'
import { FooterComponent } from '../../../shared/footer/footer.component'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { environment } from '../../../../environments/environment'

@Component({
    selector: 'app-complete-google-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
    templateUrl: './complete-google-profile.component.html',
    styleUrls: ['./complete-google-profile.component.css']
})
export class CompleteGoogleProfileComponent implements OnInit {

    telefono = ''
    password = ''
    confirmPassword = ''
    showPassword = false
    showConfirmPassword = false
    foto?: File
    previewUrl: string | null = null
    errorMessage = ''
    errors = {
        telefono: '',
        password: '',
        confirmPassword: ''
    }
    isLoading = false

    // Pre-filled from Google data
    userName = ''
    userEmail = ''
    userPhoto = ''

    private apiUrl = `${environment.apiUrlBase}/auth`

    constructor(
        private router: Router,
        private http: HttpClient,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            this.router.navigate(['/login'])
            return
        }
        this.userName = localStorage.getItem('nombre') || ''
        this.userEmail = localStorage.getItem('email') || ''
        this.userPhoto = localStorage.getItem('fotoUrl') || ''
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword
    }

    onFileSelected(event: any) {
        const file = event.target.files[0]
        if (file) {
            this.foto = file
            const reader = new FileReader()
            reader.onload = (e: any) => {
                this.previewUrl = e.target.result
                this.cdr.detectChanges()
            }
            reader.readAsDataURL(file)
        }
    }

    soloNumeros(event: KeyboardEvent): boolean {
        const char = event.key
        if (char.length > 1) return true
        return /[0-9]/.test(char)
    }

    goBack() {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('email')
        localStorage.removeItem('nombre')
        localStorage.removeItem('fotoUrl')
        localStorage.removeItem('role')
        this.router.navigate(['/login'])
    }

    save() {
        this.errors = { telefono: '', password: '', confirmPassword: '' }
        this.errorMessage = ''

        let hasError = false

        if (!this.telefono || this.telefono.trim() === '') {
            this.errors.telefono = 'El teléfono es obligatorio.'
            hasError = true
        } else if (!/^\d{10}$/.test(this.telefono.trim())) {
            this.errors.telefono = 'El teléfono debe tener exactamente 10 dígitos.'
            hasError = true
        }

        if (!this.password || this.password.trim() === '') {
            this.errors.password = 'La contraseña es obligatoria.'
            hasError = true
        } else if (!this.isPasswordValid(this.password)) {
            this.errors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.'
            hasError = true
        }

        if (this.password && this.password !== this.confirmPassword) {
            this.errors.confirmPassword = 'Las contraseñas no coinciden.'
            hasError = true
        }

        if (hasError) return

        this.isLoading = true
        const token = localStorage.getItem('accessToken')
        const formData = new FormData()

        if (this.telefono) formData.append('telefono', this.telefono)
        if (this.password) formData.append('password', this.password)
        if (this.foto) formData.append('fotoUrl', this.foto)

        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` })

        this.http.post<any>(`${this.apiUrl}/complete-profile`, formData, { headers }).subscribe({
            next: (res) => {
                if (res.nombre) localStorage.setItem('nombre', res.nombre)
                if (res.telefono) localStorage.setItem('telefono', res.telefono)
                if (res.fotoUrl) localStorage.setItem('fotoUrl', res.fotoUrl)
                this.isLoading = false
                this.navigateByRole()
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Error al guardar el perfil. Inténtalo de nuevo.'
                this.isLoading = false
                this.cdr.detectChanges()
            }
        })
    }

    isPasswordValid(password: string): boolean {
        const regex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/
        return password.length >= 8 && regex.test(password)
    }

    private navigateByRole() {
        const role = localStorage.getItem('role')
        if (role === 'ADMINISTRADOR') {
            this.router.navigate(['/admin/dashboard'])
        } else if (role === 'RECEPCIONISTA') {
            this.router.navigate(['/recepcionista/dashboard'])
        } else {
            this.router.navigate(['/cliente/my-reservations'])
        }
    }
}
