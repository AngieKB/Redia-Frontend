export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    nombre: string
    email: string
    password: string
    role: string
}

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    email: string
    role: string
}

export interface RefreshTokenRequest {
    refreshToken: string
}