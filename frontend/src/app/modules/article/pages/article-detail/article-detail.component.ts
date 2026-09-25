import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { Article } from '@app/core/models/article.model';
import { ArticleService } from '@app/core/services/article.service';
import { AuthService } from '@app/core/services/auth.service';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { SnackbarService } from '@app/shared/services/snackbar.service';

@Component({
    selector: 'app-article-detail',
    standalone: true,
    imports: [DatePipe, MatButtonModule, RouterLink],
    templateUrl: './article-detail.component.html',
    styleUrl: './article-detail.component.scss',
})
export class ArticleDetailComponent implements OnInit {
    protected readonly article = signal<Article | null>(null);

    private readonly location = inject(Location);
    private readonly authService = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly articleService = inject(ArticleService);
    private readonly dialog = inject(MatDialog);
    private readonly snackbar = inject(SnackbarService);

    protected isArticleOwner(author: string): boolean {
        return this.authService.currentUser()?.username === author;
    }

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

    deleteArticle(id: string): void {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '400px',
            data: {
                title: 'Delete article',
                message: 'Are you sure you want to delete this article?',
                confirmText: 'Delete',
                cancelText: 'Cancel',
            },
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (!confirmed) {
                return;
            }

            this.articleService.deleteArticle(id).subscribe({
                next: () => {
                    this.snackbar.open('Article deleted successfully', 'Close');

                    this.router.navigate(['/dashboard']);
                },
                error: () => {
                    this.snackbar.open('Unable to delete article', 'Close');
                },
            });
        });
    }

    goBack(): void {
        this.location.back();
    }
}
