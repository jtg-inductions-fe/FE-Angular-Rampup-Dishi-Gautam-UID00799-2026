import { Routes } from '@angular/router';

import { ROUTE_PATHS } from '@app/shared/constants/route-paths';

import { CreateArticleComponent } from './components/create-article/create-article.component';
import { UpdateArticleComponent } from './components/update-article/update-article.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const articlesRoutes: Routes = [
    {
        path: ROUTE_PATHS.dashboard,
        component: DashboardComponent,
    },
    {
        path: ROUTE_PATHS.createArticle,
        component: CreateArticleComponent,
    },
    {
        path: `${ROUTE_PATHS.articles}/:id/edit`,
        component: UpdateArticleComponent,
    },
    {
        path: `${ROUTE_PATHS.articles}/:id`,
        component: ArticleDetailComponent,
    },
];
