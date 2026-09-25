import { Routes } from '@angular/router';

import { ROUTE_PATHS } from '@app/shared/constants/route-paths';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { CreateArticleComponent } from './components/create-article/create-article.component';
import { UpdateArticleComponent } from './components/update-article/update-article.component';

export const articlesRoutes: Routes = [
    {
        path: ROUTE_PATHS.dashboard,
        component: DashboardComponent,
    },
    {
        path: `${ROUTE_PATHS.articles}/:id`,
        component: ArticleDetailComponent,
    },
];
