import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { guestGuard } from '@app/core/guards/auth.guards';

export const authRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [guestGuard],
    },
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [guestGuard],
    },
];
