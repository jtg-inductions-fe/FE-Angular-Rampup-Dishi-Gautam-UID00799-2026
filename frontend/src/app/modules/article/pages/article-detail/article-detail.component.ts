import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Article } from '@app/core/models/article.model';
import { ArticleService } from '@app/core/services/article.service';

@Component({
    selector: 'app-article-detail',
    standalone: true,
    imports: [DatePipe],
    templateUrl: './article-detail.component.html',
    styleUrl: './article-detail.component.scss',
})
export class ArticleDetailComponent implements OnInit {
    protected readonly article = signal<Article | null>(null);

    private readonly location = inject(Location);
    private readonly route = inject(ActivatedRoute);
    private readonly articleService = inject(ArticleService);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            return;
        }

        this.articleService.getArticle(id).subscribe({
            next: (article) => {
                this.article.set(article);
            },
        });
    }

    goBack(): void {
        this.location.back();
    }
}
