import { Routes } from '@angular/router';
import { HomePageComponent } from './modules/home-page/home-page.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { authGuard } from './core/guards/auth.guards';
import { authRoutes } from './modules/auth/auth.routes';

export const routes: Routes = [
    {
        path: '',
        component: HomePageComponent,
        canActivate:[authGuard]
    },
    ...authRoutes,
    {
        path: '**',
        component: NotFoundComponent,
    },
];