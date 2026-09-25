import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ArticleCardComponent } from '../../components/articles-card/articles-card.component';
import { Article } from '@app/core/models/article.model';
import { ArticleService } from '@app/core/services/article.service';
import { MatButtonModule } from '@angular/material/button';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [DatePipe, ArticleCardComponent, MatButtonModule,RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    private readonly articleService = inject(ArticleService);
    protected readonly routePaths = ROUTE_PATHS;
    readonly articles = signal<Article[]>([]);

    ngOnInit(): void {
        this.loadArticles();
    }

    private loadArticles(): void {
        this.articleService.getArticles().subscribe({
            next: (response) => {
                this.articles.set(response.data);
            },
            error: (error) => {
                console.error('Failed to load articles:', error);
            },
        });
    }
}