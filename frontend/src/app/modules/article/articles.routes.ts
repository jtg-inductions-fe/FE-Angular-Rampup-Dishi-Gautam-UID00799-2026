import { Routes } from '@angular/router';
import { DashboardComponent } from '@modules/article/pages/dashboard.component'
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { ArticleDetailComponent } from '@modules/article/pages/article-detail/article-detail.component';

export const articlesRoutes: Routes = [
    {
        path:ROUTE_PATHS.dashboard ,
        component: DashboardComponent,
    },
    {
        path:'articles/:id',
        component:ArticleDetailComponent
    }
];
