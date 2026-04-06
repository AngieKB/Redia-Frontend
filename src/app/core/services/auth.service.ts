import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AuthResponse } from '../../models/auth.model'
import { environment } from '../../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = `${environment.apiUrlBase}/auth`

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
    }): Observable<AuthResponse> {

        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data)

    }

    // Iniciar sesión con Google
    googleLogin(token: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/google`, { token })
    }

    // Recuperar contraseña
    recoverPassword(data: {
        email: string
        nuevaPassword: string
    }): Observable<any> {

        return this.http.post(`${this.apiUrl}/recover-password`, data)

    }

    // Solicitar código de restablecimiento
    requestPasswordReset(email: string, recaptchaToken: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/forgot-password`, { email, recaptchaToken }, {
            responseType: 'text' as 'json'
        })
    }

    // Restablecer contraseña con código
    resetPassword(data: {
        email: string
        verificationCode: string
        newPassword: string
    }): Observable<any> {
        return this.http.post(`${this.apiUrl}/reset-password`, data, {
            responseType: 'text' as 'json'
        })
    }

    // Cambiar contraseña (usuario autenticado)
    changePassword(data: { oldPassword: string; newPassword: string }): Observable<any> {
        const token = localStorage.getItem('accessToken');
        return this.http.post(`${this.apiUrl}/change-password`, data, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'text' as 'json'
        })
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

    // 2FA Methods
    setup2FA(): Observable<{ qrCodeUrl: string; secret: string }> {
        const token = this.getToken()
        return this.http.post<{ qrCodeUrl: string; secret: string }>(
            `${this.apiUrl}/2fa/setup`, {},
            { headers: { Authorization: `Bearer ${token}` } }
        )
    }

    enable2FA(code: number): Observable<string> {
        const token = this.getToken()
        return this.http.post<string>(
            `${this.apiUrl}/2fa/enable`, { code },
            { headers: { Authorization: `Bearer ${token}` }, responseType: 'text' as 'json' }
        )
    }

    disable2FA(): Observable<string> {
        const token = this.getToken()
        return this.http.post<string>(
            `${this.apiUrl}/2fa/disable`, {},
            { headers: { Authorization: `Bearer ${token}` }, responseType: 'text' as 'json' }
        )
    }

    verifyTwoFactor(email: string, code: number): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/2fa/verify`, { email, code })
    }

}