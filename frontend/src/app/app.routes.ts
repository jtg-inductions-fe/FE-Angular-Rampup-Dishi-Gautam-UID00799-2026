import { Routes } from '@angular/router';

import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AUTH_ROUTES } from './modules/auth/auth.routes';

export const routes: Routes = [
    {
        path: '',
        children: AUTH_ROUTES,
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];