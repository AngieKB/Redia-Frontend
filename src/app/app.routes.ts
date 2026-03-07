import { Routes } from '@angular/router'

import { HomeComponent } from './pages/home/home.component'
import { LoginComponent } from './pages/auth/login/login.component'
import { RegisterComponent } from './pages/auth/register/register.component'
import { RecoverPasswordComponent } from './pages/auth/recover-password/recover-password.component'
import { ResetPassword } from './pages/auth/reset-password.component'
import { DashboardClientComponent } from './pages/cliente/dashboard-client/dashboard-client.component'

import { DashboardAdmin } from './pages/admin/dashboard-admin/dashboard-admin'
import { Reservations as AdminReservations } from './pages/admin/reservations/reservations'
import { Users } from './pages/admin/users/users'

import { DashboardRecepcionista } from './pages/recepcionista/dashboard-recepcionista/dashboard-recepcionista'
import { Reservations as RecepcionistaReservations } from './pages/recepcionista/reservations/reservations'
import { ReservationsDetail as RecepcionistaReservationsDetail } from './pages/recepcionista/reservations-detail/reservations-detail.component'

import { CreateReservation } from './pages/cliente/create-reservation/create-reservation'
import { MyReservations } from './pages/cliente/my-reservations/my-reservations'
import { ReservationDetail } from './pages/cliente/reservation-detail/reservation-detail'

import { ProfilePage } from './pages/profile/profile-page'
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
        path: 'dashboard',
        component: DashboardClientComponent
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
        path: 'recepcionista/reservations/:id',
        component: RecepcionistaReservationsDetail
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
        path: 'cliente/reservation/:id',
        component: ReservationDetail
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