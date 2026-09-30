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
    private readonly apiUrl = `${APP_CONSTANTS.apiUrl}/articles`;

    getArticles(page = 1, pageSize = 10): Observable<Article[]> {
        const params = new HttpParams().set('page', page).set('pageSize', pageSize);

        return this.http
            .get<ApiResponse<ArticleListData>>(this.apiUrl, { params })
            .pipe(map((response) => response.data.data));
    }

    getArticle(id: string): Observable<Article> {
        return this.http
            .get<ApiResponse<Article>>(`${this.apiUrl}/${id}`)
            .pipe(map((response) => response.data));
    }

    createArticle(article: CreateArticleRequest): Observable<Article> {
        return this.http
            .post<ApiResponse<Article>>(this.apiUrl, article)
            .pipe(map((response) => response.data));
    }

    updateArticle(id: string, article: CreateArticleRequest): Observable<Article> {
        return this.http
            .put<ApiResponse<Article>>(`${this.apiUrl}/${id}`, article)
            .pipe(map((response) => response.data));
    }

    deleteArticle(id: string): Observable<Article> {
        return this.http
            .delete<ApiResponse<Article>>(`${this.apiUrl}/${id}`)
            .pipe(map((response) => response.data));
    }
}
