import { Routes } from '@angular/router';
import { DashboardComponent } from '@modules/article/pages/dashboard.component'
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';

export const articlesRoutes: Routes = [
    {
        path:ROUTE_PATHS.dashboard ,
        component: DashboardComponent,
    },
];
