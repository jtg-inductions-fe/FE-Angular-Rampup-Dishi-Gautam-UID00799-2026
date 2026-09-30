
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { Article } from '@app/core/models/article.model';
import { ArticleService } from '@app/core/services/article.service';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { SnackbarService } from '@app/shared/services/snackbar.service';

import { ArticleCardComponent } from '@modules/article/components/article-card/article-card.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ArticleCardComponent, MatButtonModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    protected readonly routePaths = ROUTE_PATHS;

    readonly articles = signal<Article[]>([]);

    private readonly articleService = inject(ArticleService);
    private readonly snackbar = inject(SnackbarService);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        this.loadArticles();
    }

    private loadArticles(): void {
        this.articleService
            .getArticles()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (articles) => {
                    this.articles.set(articles);
                },
                error: () => {
                    this.snackbar.error('Failed to load articles. Please try again.');
                },
            });
    }
}
