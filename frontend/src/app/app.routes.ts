import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './modules/auth/auth.routes';
import { HomePageComponent } from './modules/home-page/home-page.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { authGuard } from './core/guards/auth.guards';

export const routes: Routes = [
    {
        path: '',
        component: HomePageComponent,
        canActivate:[authGuard]
    },
    ...AUTH_ROUTES,
    {
        path: '**',
        component: NotFoundComponent,
    },
];