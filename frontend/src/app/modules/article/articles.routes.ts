import { Routes } from '@angular/router';

import { ROUTE_PATHS } from '@app/shared/constants/route-paths';

import { CreateArticleComponent } from '@modules/article/components/create-article/create-article.component';
import { UpdateArticleComponent } from '@modules/article/components/update-article/update-article.component';
import { ArticleDetailComponent } from '@modules/article/pages/article-detail/article-detail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const articlesRoutes: Routes = [
    {
        path: ROUTE_PATHS.dashboard,
        component: DashboardComponent,
    },
    {
        path: ROUTE_PATHS.articles,
        children: [
            {
                path: ROUTE_PATHS.createArticle,
                component: CreateArticleComponent,
            },
            {
                path: ':id/edit',
                component: UpdateArticleComponent,
            },
            {
                path: ':id',
                component: ArticleDetailComponent,
            },
        ],
    },
];
