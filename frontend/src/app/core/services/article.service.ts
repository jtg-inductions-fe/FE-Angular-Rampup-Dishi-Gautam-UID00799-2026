import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { ApiResponse } from '@app/core/models/api-response.model';
import { Article, ArticleListData } from '@app/core/models/article.model';
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
}
