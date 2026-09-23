import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Article } from '@app/core/models/article.model';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
    selector: 'app-article-card',
    standalone: true,
    imports: [DatePipe, MatButtonModule],
    templateUrl: './articles-card.component.html',
    styleUrl: './articles-card.component.scss',
})
export class ArticleCardComponent {
    readonly article = input.required<Article>();
    private readonly router=inject(Router);
    onReadArticle(): void {
    this.router.navigate(['/articles', this.article().id]);
}
}
