import { Routes } from '@angular/router'

import { HomeComponent } from './pages/home/home.component'
import { LoginComponent } from './pages/auth/login/login.component'
import { RegisterComponent } from './pages/auth/register/register.component'
import { RecoverPasswordComponent } from './pages/auth/recover-password/recover-password.component'
import { ResetPassword } from './pages/auth/reset-password/reset-password.component'

import { DashboardAdmin } from './pages/admin/dashboard-admin/dashboard-admin.component'
import { Reservations as AdminReservations } from './pages/admin/reservations/reservations.component'
import { Users } from './pages/admin/users/users.component'

import { DashboardRecepcionista } from './pages/recepcionista/dashboard-recepcionista/dashboard-recepcionista.component'
import { Reservations as RecepcionistaReservations } from './pages/recepcionista/reservations/reservations.component'

import { CreateReservation } from './pages/cliente/create-reservation/create-reservation.component'
import { MyReservations } from './pages/cliente/my-reservations/my-reservations.component'
import { SupportClientComponent } from './pages/cliente/support-client/support-client.component'

import { ProfilePage } from './pages/profile/profile-page.component'
import { SettingsPage } from './pages/settings/settings-page'
export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'register',
        component: RegisterComponent
    },

    {
        path: 'recover-password',
        component: RecoverPasswordComponent
    },

    {
        path: 'reset-password',
        component: ResetPassword
    },

    {
        path: 'home',
        component: HomeComponent
    },

    {
        path: 'admin/dashboard',
        component: DashboardAdmin
    },
    {
        path: 'admin/reservations',
        component: AdminReservations
    },
    {
        path: 'admin/users',
        component: Users
    },

    {
        path: 'recepcionista/dashboard',
        component: DashboardRecepcionista
    },
    {
        path: 'recepcionista/reservations',
        component: RecepcionistaReservations
    },

    {
        path: 'cliente/create-reservation',
        component: CreateReservation
    },
    {
        path: 'cliente/my-reservations',
        component: MyReservations
    },
    {
        path: 'cliente/support',
        component: SupportClientComponent
    },

    {
        path: 'profile',
        component: ProfilePage
    },
    {
        path: 'settings',
        component: SettingsPage
    },

    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }

]