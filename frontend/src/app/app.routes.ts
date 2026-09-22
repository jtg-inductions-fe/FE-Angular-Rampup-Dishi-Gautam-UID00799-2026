import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guards';
import { authRoutes } from './modules/auth/auth.routes';
import { HomePageComponent } from './modules/home-page/home-page.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const routes: Routes = [
    ...authRoutes,
    {
        path: '',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: HomePageComponent,
            },
            {
                path: '',
                loadChildren: () =>
                    import('./modules/article/articles.routes').then(
                        (module) => module.articlesRoutes,
                    ),
            },
        ],
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];
