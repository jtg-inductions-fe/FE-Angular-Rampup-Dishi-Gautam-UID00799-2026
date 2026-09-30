import { DatePipe, Location } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Article } from '@app/core/models/article.model';
import { ArticleService } from '@app/core/services/article.service';
import { UserService } from '@app/core/services/user.service';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { DIALOG_MESSAGES } from '@app/shared/constants/dialog-message';
import { DialogWidth } from '@app/shared/constants/dialog-width.enum';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { SnackbarService } from '@app/shared/services/snackbar.service';

@Component({
    selector: 'app-article-detail',
    standalone: true,
    imports: [DatePipe, MatButtonModule, RouterLink, MatIconModule],
    templateUrl: './article-detail.component.html',
    styleUrl: './article-detail.component.scss',
})
export class ArticleDetailComponent implements OnInit {
    protected readonly article = signal<Article | null>(null);

    protected readonly isOwner = signal(false);

    protected readonly routePaths = ROUTE_PATHS;

    private readonly location = inject(Location);
    private readonly userService = inject(UserService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly articleService = inject(ArticleService);
    private readonly dialog = inject(MatDialog);
    private readonly snackbar = inject(SnackbarService);
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const id = params.get('id');

            if (!id) {
                this.router.navigate(['/', this.routePaths.dashboard]);
                return;
            }

            this.loadArticle(id);
        });
    }

    protected deleteArticle(id: string): void {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: DialogWidth.Small,
            data: DIALOG_MESSAGES.dialogs.deleteArticle,
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((confirmed: boolean) => {
                if (!confirmed) {
                    return;
                }

                this.articleService
                    .deleteArticle(id)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: () => {
                            this.snackbar.success('Article deleted successfully.');

                            this.router.navigate(['/', this.routePaths.dashboard]);
                        },
                        error: (error) => {
                            this.snackbar.error(
                                error.error?.message ?? 'Unable to delete article.',
                            );
                        },
                    });
            });
    }

    protected goBack(): void {
        this.location.back();
    }

    private loadArticle(id: string): void {
        this.articleService
            .getArticle(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (article) => {
                    this.article.set(article);

                    this.isOwner.set(this.userService.getUser()?.username === article.author);
                },
                error: (error) => {
                    if (error.status === 404) {
                        this.snackbar.error('Article not found.');
                    } else {
                        this.snackbar.error('Failed to load article. Please try again.');
                    }

                    this.router.navigate(['/', this.routePaths.dashboard]);
                },
            });
    }
}
