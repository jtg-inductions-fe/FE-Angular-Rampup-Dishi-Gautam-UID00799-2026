import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { authRoutes } from './modules/auth/auth.routes';

export const routes: Routes = [
    {
        path: '',
        children: authRoutes,
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];