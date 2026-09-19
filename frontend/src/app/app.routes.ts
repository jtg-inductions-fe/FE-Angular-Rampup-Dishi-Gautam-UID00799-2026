import { Routes } from '@angular/router';
import { authRoutes } from './modules/auth/auth.routes';
import { authGuard } from './core/guards/auth.guards';
import { HomePageComponent } from './modules/home-page/home-page.component';
import {NotFoundComponent} from './shared/components/not-found/not-found.component'

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