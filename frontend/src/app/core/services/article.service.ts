import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { ApiResponse } from '@app/core/models/api-response.model';
import {
    Article,
    ArticleFilters,
    ArticleListData,
    CreateArticleRequest,
} from '@app/core/models/article.model';
import { environment } from '@app/environments/enviornments';

@Injectable({
    providedIn: 'root',
})
export class ArticleService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/articles`;

    getArticles(
        page = 1,
        pageSize = 10,
        filters: ArticleFilters = {},
    ): Observable<ArticleListData> {
        let params = new HttpParams().set('page', page).set('pageSize', pageSize);

        const search = filters.search?.trim();

        if (search) {
            params = params.set('search', search);
        }

        const author = filters.author?.trim();

        if (author) {
            params = params.set('author', author);
        }

        if (filters.tags?.length) {
            params = params.set('tags', filters.tags.join(','));
        }

        return this.http
            .get<ApiResponse<ArticleListData>>(this.apiUrl, { params })
            .pipe(map((response) => response.data));
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
