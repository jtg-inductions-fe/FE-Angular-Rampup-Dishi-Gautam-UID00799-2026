import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { ArticleListData, ArticleListResponse } from '../models/article.model';

@Injectable({
    providedIn: 'root',
})
export class ArticleService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = 'http://localhost:3000/api/v1/articles';

    getArticles(page: number = 1, pageSize: number = 10): Observable<ArticleListData> {
        const params = new HttpParams().set('page', page).set('pageSize', pageSize);

        return this.http
            .get<ArticleListResponse>(this.apiUrl, { params })
            .pipe(map((response) => response.data));
    }
}
