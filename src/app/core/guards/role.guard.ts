import { inject } from '@angular/core'
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router'
import { AuthService } from '../services/auth.service'

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

    const authService = inject(AuthService)
    const router = inject(Router)

    const expectedRoles = route.data['roles']
    const role = authService.getRole()

    if (expectedRoles.includes(role)) {
        return true
    }

    router.navigate(['/login'])
    return false
}