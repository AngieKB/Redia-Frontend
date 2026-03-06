import { Routes } from '@angular/router'

import { LoginComponent } from './pages/auth/login/login.component'
import { RegisterComponent } from './pages/auth/register/register.component'
import { RecoverPasswordComponent } from './pages/auth/recover-password/recover-password.component'

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
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }

]