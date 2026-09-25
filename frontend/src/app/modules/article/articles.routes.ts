import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { CreateArticleComponent } from './components/create-article/create-article.component';
import { UpdateArticleComponent } from './components/update-article/update-article.component';

export const articlesRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'articles/create',
        component: CreateArticleComponent,
    },
      {
        path:'articles/:id',
        component:ArticleDetailComponent
    },
    {
        path:'articles/:id/edit',
        component:UpdateArticleComponent
    }
];
