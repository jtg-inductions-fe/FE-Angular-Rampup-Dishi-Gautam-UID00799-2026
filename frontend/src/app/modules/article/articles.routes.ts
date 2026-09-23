import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';

export const articlesRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path:'articles/:id',
        component:ArticleDetailComponent
    }
];
