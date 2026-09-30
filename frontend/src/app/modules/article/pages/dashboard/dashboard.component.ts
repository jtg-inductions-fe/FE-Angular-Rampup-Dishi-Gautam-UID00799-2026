import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { EMPTY, catchError, map, switchMap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';

import { Article, ArticleFilters } from '@app/core/models/article.model';
import { ArticleService } from '@app/core/services/article.service';
import {
    ArticleFilterComponent,
    ArticleFilterValue,
} from '@app/shared/components/article-filter/article-filter.component';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { SnackbarService } from '@app/shared/services/snackbar.service';

import { ArticleCardComponent } from '@modules/article/components/article-card/article-card.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ArticleCardComponent,
        ArticleFilterComponent,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        MatSidenavModule,
        RouterLink,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
    protected readonly routePaths = ROUTE_PATHS;

    protected readonly articles = signal<Article[]>([]);
    protected readonly currentPage = signal(1);
    protected readonly totalPages = signal(1);
    protected readonly totalItems = signal(0);
    protected readonly pageSize = signal(10);

    protected readonly searchControl = new FormControl('', {
        nonNullable: true,
    });

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly articleService = inject(ArticleService);
    private readonly snackbar = inject(SnackbarService);
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.loadArticles();
    }

    protected applyFilters(filters: ArticleFilterValue): void {
        const search = this.searchControl.value.trim();

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                search: search || null,
                author: filters.author || null,
                tags: filters.tags || null,
                page: 1,
            },
        });
    }

    protected clearFilters(): void {
        this.searchControl.setValue('');

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                search: null,
                author: null,
                tags: null,
                page: null,
            },
        });
    }

    protected applyAndCloseFilters(filters: ArticleFilterValue): void {
        this.applyFilters(filters);
    }

    protected clearAndCloseFilters(): void {
        this.clearFilters();
    }

    protected changePage(event: PageEvent): void {
        const pageSizeChanged = event.pageSize !== this.pageSize();

        this.pageSize.set(event.pageSize);

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                page: pageSizeChanged ? 1 : event.pageIndex + 1,
            },
            queryParamsHandling: 'merge',
        });
    }

    private loadArticles(): void {
        this.route.queryParamMap
            .pipe(
                map((params) => this.getFiltersFromParams(params)),
                switchMap(({ page, filters }) =>
                    this.articleService.getArticles(page, this.pageSize(), filters).pipe(
                        catchError((error) => {
                            console.error('Failed to load articles:', error);

                            this.articles.set([]);
                            this.totalPages.set(1);
                            this.totalItems.set(0);

                            this.snackbar.error('Failed to load articles. Please try again.');

                            return EMPTY;
                        }),
                    ),
                ),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: (response) => {
                    this.articles.set(response.data);

                    this.totalPages.set(response.totalPages);

                    this.totalItems.set(response.totalItems);

                    this.currentPage.set(response.currentPage);

                    this.pageSize.set(response.pageSize);
                },
            });
    }

    private getFiltersFromParams(params: ParamMap): {
        page: number;
        filters: ArticleFilters;
    } {
        const search = params.get('search')?.trim() ?? '';

        const author = params.get('author')?.trim() ?? '';

        const tags =
            params
                .get('tags')
                ?.split(',')
                .map((tag) => tag.trim())
                .filter(Boolean) ?? [];

        const pageParam = Number(params.get('page')) || 1;

        const page = pageParam > 0 ? pageParam : 1;

        this.searchControl.setValue(search, {
            emitEvent: false,
        });

        this.currentPage.set(page);

        return {
            page,
            filters: {
                search,
                author,
                tags,
            },
        };
    }
}
