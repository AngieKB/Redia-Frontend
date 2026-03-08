import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AuthResponse } from '../../models/auth.model'

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'http://localhost:8080/api/auth'

    constructor(private http: HttpClient) { }

    // Registrarse
    register(data: {
        nombre: string
        email: string
        telefono: string
        password: string
        role: string
        recaptchaToken: string
        fotoUrl?: File
    }): Observable<any> {

        const formData = new FormData()

        formData.append('nombre', data.nombre)
        formData.append('email', data.email)
        formData.append('telefono', data.telefono)
        formData.append('password', data.password)
        formData.append('role', data.role)
        formData.append('recaptchaToken', data.recaptchaToken)

        if (data.fotoUrl) {
            formData.append('fotoUrl', data.fotoUrl)
        }

        return this.http.post(`${this.apiUrl}/register`, formData, {
            responseType: 'text'
        })
    }

    // Iniciar sesión
    login(data: {
        email: string
        password: string
        recaptchaToken: string
    }): Observable<AuthResponse> {

        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data)

    }

    // Recuperar contraseña
    recoverPassword(data: {
        email: string
        nuevaPassword: string
    }): Observable<any> {

        return this.http.post(`${this.apiUrl}/recover-password`, data)

    }

    // Solicitar código de restablecimiento
    requestPasswordReset(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/request-password-reset`, { email })
    }

    // Restablecer contraseña con código
    resetPassword(data: {
        email: string
        verificationCode: string
        newPassword: string
    }): Observable<any> {
        return this.http.post(`${this.apiUrl}/reset-password`, data)
    }

    // Actualizar contraseña
    refreshToken(): Observable<any> {

        const refreshToken = localStorage.getItem('refreshToken')

        return this.http.post(`${this.apiUrl}/refresh`, {
            refreshToken: refreshToken
        })

    }

    // Cerrar sesión
    logout() {

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('role')

    }

    // Token
    getToken(): string | null {
        return localStorage.getItem('accessToken')
    }

    getRole(): string | null {
        return localStorage.getItem('role')
    }

    isLogged(): boolean {
        return !!localStorage.getItem('accessToken')
    }

}