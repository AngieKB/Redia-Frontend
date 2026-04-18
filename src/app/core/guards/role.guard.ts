import { inject } from '@angular/core'
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router'
import { AuthService } from '../services/auth.service'

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

    const authService = inject(AuthService)
    const router = inject(Router)

    if (!authService.isLogged()) {
        router.navigate(['/login'])
        return false
    }

    const expectedRoles: string[] = route.data['roles']
    const role = authService.getRole()

    if (role && expectedRoles.includes(role)) {
        return true
    }

    // Authenticated but wrong role → redirect to own dashboard
    if (role === 'ADMINISTRADOR') {
        router.navigate(['/admin/dashboard'])
    } else if (role === 'RECEPCIONISTA') {
        router.navigate(['/recepcionista/dashboard'])
    } else if (role === 'MESERO') {
        router.navigate(['/mesero/dashboard'])
    } else if (role === 'COCINERO') {
        router.navigate(['/cocinero/dashboard'])
    } else if (role === 'CAJERO') {
        router.navigate(['/cajero/dashboard'])
    } else {
        router.navigate(['/cliente/my-reservations'])
    }

    return false
}