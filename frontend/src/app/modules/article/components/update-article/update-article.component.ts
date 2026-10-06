import { NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ArticleService } from '@app/core/services/article.service';
import {
    ARTICLE_EDITOR_MODULES,
    ARTICLE_FORM_CONFIG,
    ARTICLE_FORM_FIELDS,
    ARTICLE_FORM_LIMITS,
} from '@app/shared/constants/article-form.constants';
import { RichTextEditorComponent } from '@app/shared/components/rich-text-editor/rich-text-editor';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { SnackbarService } from '@app/shared/services/snackbar.service';

@Component({
    selector: 'app-update-article',
    standalone: true,
    imports: [
        MatButtonModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NgOptimizedImage,
        ReactiveFormsModule,
        RichTextEditorComponent,
        RouterLink,
    ],
    templateUrl: './update-article.component.html',
    styleUrl: './update-article.component.scss',
})
export class UpdateArticleComponent implements OnInit {
    private readonly formBuilder = inject(NonNullableFormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly articleService = inject(ArticleService);
    private readonly snackbar = inject(SnackbarService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly routePaths = ROUTE_PATHS;
    protected readonly formFields = ARTICLE_FORM_FIELDS;
    protected readonly formConfig = ARTICLE_FORM_CONFIG;
    protected readonly editorModules = ARTICLE_EDITOR_MODULES;
    protected readonly formLimits = ARTICLE_FORM_LIMITS;

    protected readonly isSubmitting = signal(false);

    protected readonly articleForm = this.formBuilder.group({
        title: [
            '',
            [Validators.required, Validators.maxLength(ARTICLE_FORM_LIMITS.titleMaxLength)],
        ],
        shortDescription: ['', Validators.maxLength(ARTICLE_FORM_LIMITS.shortDescriptionMaxLength)],
        description: [
            '',
            [
                Validators.required,
                Validators.minLength(ARTICLE_FORM_LIMITS.descriptionMinLength),
                Validators.maxLength(ARTICLE_FORM_LIMITS.descriptionMaxLength),
            ],
        ],
        image: ['', Validators.required],
        tags: [
            [] as string[],
            [
                Validators.required,
                Validators.minLength(ARTICLE_FORM_LIMITS.tagsMinLength),
                Validators.maxLength(ARTICLE_FORM_LIMITS.tagsMaxLength),
            ],
        ],
        tagInput: [''],
    });

    private articleId = '';

    ngOnInit(): void {
        this.loadArticleId();
    }

    protected onImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) {
            return;
        }

        this.readImage(file);
    }

    protected addTag(): void {
        const tag = this.articleForm.controls.tagInput.value.trim();

        if (!tag) {
            return;
        }

        const currentTags = this.articleForm.controls.tags.value;

        if (currentTags.includes(tag)) {
            this.clearTagInput();
            return;
        }

        this.articleForm.controls.tags.setValue([...currentTags, tag]);

        this.articleForm.controls.tags.markAsDirty();
        this.articleForm.controls.tags.markAsTouched();

        this.clearTagInput();
    }

    protected removeTag(tagToRemove: string): void {
        const currentTags = this.articleForm.controls.tags.value;

        this.articleForm.controls.tags.setValue(currentTags.filter((tag) => tag !== tagToRemove));

        this.articleForm.controls.tags.markAsDirty();
        this.articleForm.controls.tags.markAsTouched();
    }

    protected onSubmit(): void {
        if (!this.canSubmit()) {
            return;
        }

        this.isSubmitting.set(true);

        this.updateArticle()
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.isSubmitting.set(false)),
            )
            .subscribe({
                next: () => this.handleUpdateSuccess(),
                error: (error) => this.handleUpdateError(error),
            });
    }

    private loadArticleId(): void {
        this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const id = params.get('id');

            if (!id) {
                this.handleMissingArticleId();
                return;
            }

            this.articleId = id;
            this.loadArticle();
        });
    }

    private loadArticle(): void {
        this.articleService
            .getArticle(this.articleId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (article) => {
                    this.articleForm.patchValue({
                        title: article.title,
                        shortDescription: article.shortDescription,
                        description: article.description,
                        image: article.image,
                        tags: article.tags,
                    });

                    this.articleForm.markAsPristine();
                },
                error: (error) => this.handleLoadError(error),
            });
    }

    private updateArticle() {
        const formValue = this.articleForm.getRawValue();

        return this.articleService.updateArticle(this.articleId, {
            title: formValue.title,
            shortDescription: formValue.shortDescription.trim(),
            description: formValue.description,
            image: formValue.image,
            tags: formValue.tags,
        });
    }

    private canSubmit(): boolean {
        if (this.articleForm.invalid) {
            this.articleForm.markAllAsTouched();
            return false;
        }

        if (!this.articleId) {
            this.snackbar.error('Unable to update article.');
            return false;
        }

        if (this.isSubmitting()) {
            return false;
        }

        return true;
    }

    private handleUpdateSuccess(): void {
        this.snackbar.success('Article updated successfully.');

        this.router.navigate(['/', this.routePaths.dashboard]);
    }

    private handleUpdateError(error: {
        error?: {
            message?: string;
        };
    }): void {
        this.snackbar.error(error.error?.message ?? 'Unable to update article.');
    }

    private handleMissingArticleId(): void {
        this.snackbar.error('Article ID is missing.');

        this.router.navigate(['/', this.routePaths.dashboard]);
    }

    private handleLoadError(error: {
        error?: {
            message?: string;
        };
    }): void {
        this.snackbar.error(error.error?.message ?? 'Unable to load article.');

        this.router.navigate(['/', this.routePaths.dashboard]);
    }

    private readImage(file: File): void {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                return;
            }

            this.articleForm.controls.image.setValue(reader.result);

            this.articleForm.controls.image.markAsDirty();
            this.articleForm.controls.image.markAsTouched();
        };

        reader.readAsDataURL(file);
    }

    private clearTagInput(): void {
        this.articleForm.controls.tagInput.setValue('');
    }
}
