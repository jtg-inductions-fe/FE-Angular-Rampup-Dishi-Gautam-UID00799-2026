import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { ApiResponse } from '@app/core/models/api-response.model';
import { Article, ArticleListData, CreateArticleRequest } from '@app/core/models/article.model';
import { APP_CONSTANTS } from '@app/shared/constants/app.constants';

@Injectable({
    providedIn: 'root',
})
export class ArticleService {
    private readonly http = inject(HttpClient);

    getArticles(page = 1, pageSize = 10): Observable<Article[]> {
        const params = new HttpParams().set('page', page).set('pageSize', pageSize);

        return this.http
            .get<ApiResponse<ArticleListData>>(`${APP_CONSTANTS.apiUrl}/articles`, { params })
            .pipe(map((response) => response.data.data));
    }

    getArticle(id: string): Observable<Article> {
        return this.http
            .get<ApiResponse<Article>>(`${APP_CONSTANTS.apiUrl}/articles/${id}`)
            .pipe(map((response) => response.data));
    }

    createArticle(article: CreateArticleRequest): Observable<Article> {
        return this.http
            .post<ApiResponse<Article>>(`${APP_CONSTANTS.apiUrl}/articles`, article)
            .pipe(map((response) => response.data));
    }

    updateArticle(id: string, article: CreateArticleRequest): Observable<Article> {
        return this.http
            .put<ApiResponse<Article>>(`${APP_CONSTANTS.apiUrl}/articles/${id}`, article)
            .pipe(map((response) => response.data));
    }

    deleteArticle(id: string): Observable<Article> {
        return this.http
            .delete<ApiResponse<Article>>(`${APP_CONSTANTS.apiUrl}/articles/${id}`)
            .pipe(map((response) => response.data));
    }
}
