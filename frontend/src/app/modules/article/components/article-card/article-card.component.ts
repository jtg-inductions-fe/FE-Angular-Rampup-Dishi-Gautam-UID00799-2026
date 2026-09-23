import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

import { Article } from '@app/core/models/article.model';

@Component({
    selector: 'app-article-card',
    standalone: true,
    imports: [DatePipe, MatButtonModule],
    templateUrl: './article-card.component.html',
    styleUrl: './article-card.component.scss',
})
export class ArticleCardComponent {
    @Input({ required: true })
    readonly article!: Article;
}
