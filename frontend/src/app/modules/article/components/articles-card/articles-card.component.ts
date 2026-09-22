import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Article } from '@app/core/models/article.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-article-card',
    standalone: true,
    imports: [DatePipe, MatButtonModule],
    templateUrl: './articles-card.component.html',
    styleUrl: './articles-card.component.scss',
})
export class ArticleCardComponent {
    readonly article = input.required<Article>();
}
