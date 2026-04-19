import { Routes } from '@angular/router'
import { AuthGuard } from './core/guards/auth.guard'
import { RoleGuard } from './core/guards/role.guard'

import { HomeComponent } from './pages/home/home.component'
import { LoginComponent } from './pages/auth/login/login.component'
import { RegisterComponent } from './pages/auth/register/register.component'
import { RecoverPasswordComponent } from './pages/auth/recover-password/recover-password.component'
import { ResetPassword } from './pages/auth/reset-password/reset-password.component'
import { CompleteGoogleProfileComponent } from './pages/auth/complete-google-profile/complete-google-profile.component'

import { DashboardAdmin } from './pages/admin/dashboard-admin/dashboard-admin.component'
import { Reservations as AdminReservations } from './pages/admin/reservations/reservations.component'
import { Users } from './pages/admin/users/users.component'
import { TablesComponent } from './pages/admin/tables/tables.component'
import { AdminMenuComponent } from './pages/admin/menu/menu.component'

import { DashboardRecepcionista } from './pages/recepcionista/dashboard-recepcionista/dashboard-recepcionista.component'
import { Reservations as RecepcionistaReservations } from './pages/recepcionista/reservations/reservations.component'

import { CreateReservation } from './pages/cliente/create-reservation/create-reservation.component'
import { MyReservations } from './pages/cliente/my-reservations/my-reservations.component'
import { SupportClientComponent } from './pages/cliente/support-client/support-client.component'

import { ProfilePage } from './pages/profile/profile-page.component'
import { PrivacyPolicyComponent } from './pages/legal/privacy-policy/privacy-policy.component'

export const routes: Routes = [

    // ──────────────────────────────────
    // Rutas públicas (sin autenticación)
    // ──────────────────────────────────
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'recover-password', component: RecoverPasswordComponent },
    { path: 'reset-password', component: ResetPassword },
    { path: 'politica-de-datos', component: PrivacyPolicyComponent },

    // Completa el perfil de Google (requiere token del login de Google)
    {
        path: 'complete-google-profile',
        component: CompleteGoogleProfileComponent,
        canActivate: [AuthGuard]
    },

    // ──────────────────────────────────────────
    // Rutas de ADMINISTRADOR
    // ──────────────────────────────────────────
    {
        path: 'admin/dashboard',
        component: DashboardAdmin,
        canActivate: [RoleGuard],
        data: { roles: ['ADMINISTRADOR'] }
    },
    {
        path: 'admin/reservations',
        component: AdminReservations,
        canActivate: [RoleGuard],
        data: { roles: ['ADMINISTRADOR'] }
    },
    {
        path: 'admin/users',
        component: Users,
        canActivate: [RoleGuard],
        data: { roles: ['ADMINISTRADOR'] }
    },
    {
        path: 'admin/tables',
        component: TablesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMINISTRADOR'] }
    },
    {
        path: 'admin/menu',
        component: AdminMenuComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMINISTRADOR'] }
    },

    // ──────────────────────────────────────────
    // Rutas de RECEPCIONISTA
    // ──────────────────────────────────────────
    {
        path: 'recepcionista/dashboard',
        component: DashboardRecepcionista,
        canActivate: [RoleGuard],
        data: { roles: ['RECEPCIONISTA'] }
    },
    {
        path: 'recepcionista/reservations',
        component: RecepcionistaReservations,
        canActivate: [RoleGuard],
        data: { roles: ['RECEPCIONISTA'] }
    },

    // ──────────────────────────────────────────
    // Rutas de CLIENTE
    // ──────────────────────────────────────────
    {
        path: 'cliente/create-reservation',
        component: CreateReservation,
        canActivate: [RoleGuard],
        data: { roles: ['CLIENTE'] }
    },
    {
        path: 'cliente/my-reservations',
        component: MyReservations,
        canActivate: [RoleGuard],
        data: { roles: ['CLIENTE'] }
    },
    {
        path: 'cliente/support',
        component: SupportClientComponent,
        canActivate: [RoleGuard],
        data: { roles: ['CLIENTE'] }
    },

    // ──────────────────────────────────────────
    // Rutas de PERSONAL (Mesero, Cocinero, Cajero)
    // ──────────────────────────────────────────
    {
        path: 'mesero/dashboard',
        loadComponent: () => import('./pages/mesero/dashboard-mesero/dashboard-mesero.component').then(m => m.DashboardMeseroComponent),
        canActivate: [RoleGuard],
        data: { roles: ['MESERO'] }
    },
    {
        path: 'cocinero/dashboard',
        loadComponent: () => import('./pages/cocinero/dashboard-cocinero/dashboard-cocinero.component').then(m => m.DashboardCocineroComponent),
        canActivate: [RoleGuard],
        data: { roles: ['COCINERO'] }
    },
    {
        path: 'cajero/dashboard',
        loadComponent: () => import('./pages/cajero/dashboard-cajero/dashboard-cajero.component').then(m => m.DashboardCajeroComponent),
        canActivate: [RoleGuard],
        data: { roles: ['CAJERO'] }
    },


    // ──────────────────────────────────────────
    // Rutas compartidas (cualquier usuario autenticado)
    // ──────────────────────────────────────────
    {
        path: 'profile',
        component: ProfilePage,
        canActivate: [AuthGuard]
    },

    // ──────────────────────────────────────────
    // Ruta raíz
    // ──────────────────────────────────────────
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }

]