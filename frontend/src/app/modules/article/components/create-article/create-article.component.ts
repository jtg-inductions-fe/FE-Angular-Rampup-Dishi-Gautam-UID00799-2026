import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    AbstractControl,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Article, ArticleValidationError } from '@app/core/models/article.model';
import { ArticleService } from '@app/core/services/article.service';
import { RichTextEditorComponent } from '@app/shared/components/rich-text-editor/rich-text-editor';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { DIALOG_MESSAGES } from '@app/shared/constants/dialog-message';
import { DialogWidth } from '@app/shared/constants/dialog-width.enum';
import {
    ARTICLE_EDITOR_MODULES,
    ARTICLE_FORM_CONFIG,
    ARTICLE_FORM_FIELDS,
    ARTICLE_FORM_LIMITS,
} from '@app/shared/constants/article-form.constants';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { SnackbarService } from '@app/shared/services/snackbar.service';

@Component({
    selector: 'app-create-article',
    standalone: true,
    imports: [
        MatButtonModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        RouterLink,
        RichTextEditorComponent,
    ],
    templateUrl: './create-article.component.html',
    styleUrl: './create-article.component.scss',
})
export class CreateArticleComponent implements OnInit {
    protected readonly routePaths = ROUTE_PATHS;
    protected readonly formFields = ARTICLE_FORM_FIELDS;
    protected readonly formConfig = ARTICLE_FORM_CONFIG;
    protected readonly editorModules = ARTICLE_EDITOR_MODULES;
    protected readonly formLimits = ARTICLE_FORM_LIMITS;

    private readonly formBuilder = inject(NonNullableFormBuilder);

    protected readonly articleForm = this.formBuilder.group({
        title: [
            '',
            [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(ARTICLE_FORM_LIMITS.titleMaxLength),
            ],
        ],
        shortDescription: ['', Validators.maxLength(ARTICLE_FORM_LIMITS.shortDescriptionMaxLength)],
        description: ['', [Validators.required, this.minPlainTextLength(50)]],
        image: ['', Validators.required],
        tags: [[] as string[], Validators.required],
    });

    protected isSubmitting = false;
    protected tagInput = '';
    protected isEditMode = false;

    private articleId: string | null = null;
    private readonly articleService = inject(ArticleService);
    private readonly dialog = inject(MatDialog);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly snackbar = inject(SnackbarService);
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.articleId = this.route.snapshot.paramMap.get('id');

        this.isEditMode = !!this.articleId;

        if (this.articleId) {
            this.loadArticle(this.articleId);
        }
    }

    protected onImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string' && reader.result.startsWith('data:image/')) {
                this.articleForm.controls.image.setValue(reader.result);

                this.articleForm.controls.image.markAsTouched();
                this.articleForm.controls.image.markAsDirty();
            }
        };

        reader.readAsDataURL(file);
    }

    protected onTagInput(event: Event): void {
        const input = event.target as HTMLInputElement;

        this.tagInput = input.value;
    }

    protected addTag(): void {
        const tag = this.tagInput.trim();

        if (!tag) {
            return;
        }

        const tags = this.articleForm.controls.tags.value;

        if (tags.includes(tag)) {
            this.tagInput = '';
            return;
        }

        this.articleForm.controls.tags.setValue([...tags, tag]);

        this.articleForm.controls.tags.markAsTouched();
        this.articleForm.controls.tags.markAsDirty();

        this.tagInput = '';
    }

    protected removeTag(tagToRemove: string): void {
        const tags = this.articleForm.controls.tags.value;

        this.articleForm.controls.tags.setValue(tags.filter((tag) => tag !== tagToRemove));

        this.articleForm.controls.tags.markAsTouched();
        this.articleForm.controls.tags.markAsDirty();
    }

    protected onSubmit(): void {
        this.articleForm.markAllAsTouched();

        if (this.articleForm.invalid || this.isSubmitting) {
            return;
        }

        this.isSubmitting = true;

        const article = this.buildArticleRequest();

        const request$ = this.articleId
            ? this.articleService.updateArticle(this.articleId, article)
            : this.articleService.createArticle(article);

        request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.handleArticleSaveSuccess(),
            error: (error: HttpErrorResponse) => {
                this.isSubmitting = false;
                this.handleArticleSaveError(error);
            },
        });
    }

    private buildArticleRequest() {
        const formValue = this.articleForm.getRawValue();

        return {
            title: formValue.title,
            shortDescription: formValue.shortDescription.trim(),
            description: formValue.description,
            image: formValue.image,
            tags: formValue.tags,
        };
    }

    private loadArticle(id: string): void {
        this.articleService
            .getArticle(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (article: Article) => {
                    this.articleForm.patchValue({
                        title: article.title,
                        shortDescription: article.shortDescription,
                        description: article.description,
                        image: article.image,
                        tags: article.tags,
                    });

                    this.articleForm.markAsPristine();
                },
                error: (error: HttpErrorResponse) => {
                    this.handleArticleLoadError(error);
                },
            });
    }

    private handleArticleSaveSuccess(): void {
        this.isSubmitting = false;

        this.snackbar.success(
            this.isEditMode ? 'Article updated successfully.' : 'Article created successfully.',
        );

        this.router.navigate(['/', this.routePaths.dashboard]);
    }

    private handleArticleLoadError(error: HttpErrorResponse): void {
        if (error.status === 404) {
            this.snackbar.error('Article not found.');
        } else {
            this.snackbar.error('Unable to load article. Please try again.');
        }

        this.router.navigate(['/', this.routePaths.dashboard]);
    }

    private handleArticleSaveError(error: HttpErrorResponse): void {
        if (error.status === 400) {
            this.applyBackendValidationErrors(error);
            return;
        }

        this.openSaveErrorDialog(
            error.error?.message ?? 'Something went wrong while saving the article.',
        );
    }

    private applyBackendValidationErrors(error: HttpErrorResponse): void {
        const validationErrors = error.error?.error as ArticleValidationError[] | undefined;

        if (!Array.isArray(validationErrors)) {
            this.openSaveErrorDialog(error.error?.message ?? 'Please check your article details.');
            return;
        }

        validationErrors.forEach(({ field, message }) => {
            const control = this.articleForm.get(field);

            if (!control) {
                return;
            }

            control.setErrors({
                ...control.errors,
                backend: message,
            });

            control.markAsTouched();
        });
    }

    private openSaveErrorDialog(message: string): void {
        this.dialog.open(DialogComponent, {
            width: DialogWidth.Small,
            data: {
                ...DIALOG_MESSAGES.dialogs.createArticleError,
                message,
            },
        });
    }

    private minPlainTextLength(minimumLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const plainText = this.getPlainText(control.value ?? '');

            if (!plainText) {
                return null;
            }

            return plainText.length >= minimumLength
                ? null
                : {
                      minlength: {
                          requiredLength: minimumLength,
                          actualLength: plainText.length,
                      },
                  };
        };
    }

    private getPlainText(content: string): string {
        const parser = new DOMParser();
        const document = parser.parseFromString(content, 'text/html');

        return (document.body.textContent ?? '')
            .replace(/\u00a0/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
}
