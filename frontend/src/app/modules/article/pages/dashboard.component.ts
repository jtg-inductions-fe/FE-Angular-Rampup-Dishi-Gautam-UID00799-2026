import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Article } from '@app/core/models/article.model';
import { ArticleService } from '@app/core/services/article.service';

import { ArticleCardComponent } from '../components/article-card/article-card.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ArticleCardComponent, MatButtonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    private readonly articleService = inject(ArticleService);
    private readonly snackBar = inject(MatSnackBar);
    private readonly destroyRef = inject(DestroyRef);

    readonly articles = signal<Article[]>([]);

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
                    this.snackBar.open('Failed to load articles. Please try again.', 'Close', {
                        duration: 3000,
                    });
                },
            });
    }
}
