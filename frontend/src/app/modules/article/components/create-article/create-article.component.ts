import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillModule } from 'ngx-quill';

import { ArticleService } from '@app/core/services/article.service';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { SnackbarService } from '@app/shared/services/snackbar.service';

interface ArticleValidationError {
    field: string;
    message: string;
}

@Component({
    selector: 'app-create-article',
    standalone: true,
    imports: [
        MatButtonModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        QuillModule,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: './create-article.component.html',
    styleUrl: './create-article.component.scss',
})
export class CreateArticleComponent {
    protected readonly routePaths = ROUTE_PATHS;

    protected readonly editorModules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ header: [1, 2, 3, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'blockquote', 'code-block'],
        ],
    };

    protected readonly articleForm = inject(FormBuilder).group({
        title: ['', [Validators.required, Validators.maxLength(200)]],
        shortDescription: [''],
        description: ['', Validators.required],
        image: ['', Validators.required],
        tags: [[] as string[], Validators.required],
    });

    protected isSubmitting = false;
    protected tagInput = '';

    private readonly articleService = inject(ArticleService);
    private readonly router = inject(Router);
    private readonly snackbar = inject(SnackbarService);

    onImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string' && reader.result.startsWith('data:image/')) {
                this.articleForm.controls.image.setValue(reader.result);

                this.articleForm.controls.image.updateValueAndValidity();
            }
        };

        reader.readAsDataURL(file);
    }

    onTagInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.tagInput = input.value;
    }

    addTag(): void {
        const tag = this.tagInput.trim();

        if (!tag) {
            return;
        }

        const currentTags = this.articleForm.controls.tags.value ?? [];

        if (currentTags.includes(tag)) {
            this.tagInput = '';
            return;
        }

        this.articleForm.controls.tags.setValue([...currentTags, tag]);

        this.articleForm.controls.tags.markAsTouched();
        this.articleForm.controls.tags.updateValueAndValidity();

        this.tagInput = '';
    }

    removeTag(tagToRemove: string): void {
        const currentTags = this.articleForm.controls.tags.value ?? [];

        this.articleForm.controls.tags.setValue(currentTags.filter((tag) => tag !== tagToRemove));

        this.articleForm.controls.tags.markAsTouched();
        this.articleForm.controls.tags.updateValueAndValidity();
    }

    onSubmit(): void {
        if (this.articleForm.invalid || this.isSubmitting) {
            this.articleForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;

        const formValue = this.articleForm.getRawValue();

        const shortDescription = this.createShortDescription(formValue.description ?? '');

        this.articleService
            .createArticle({
                title: formValue.title ?? '',
                shortDescription,
                description: formValue.description ?? '',
                image: formValue.image ?? '',
                tags: formValue.tags ?? [],
            })
            .subscribe({
                next: () => {
                    this.isSubmitting = false;

                    this.snackbar.open('Article created successfully', 'Close');

                    this.router.navigate([this.routePaths.dashboard]);
                },
                error: (error: HttpErrorResponse) => {
                    this.isSubmitting = false;
                    this.handleCreateError(error);
                },
            });
    }

    private handleCreateError(error: HttpErrorResponse): void {
        if (error.status === 400) {
            this.setBackendValidationErrors(error);
            return;
        }

        if (error.status === 401) {
            this.snackbar.open('Your session has expired. Please login again.', 'Close');

            return;
        }

        if (error.status === 403) {
            this.snackbar.open('You are not allowed to create this article.', 'Close');

            return;
        }

        if (error.status === 429) {
            this.snackbar.open('Too many requests. Please try again later.', 'Close');

            return;
        }

        this.snackbar.open('Unable to create the article. Please try again.', 'Close');
    }

    private setBackendValidationErrors(error: HttpErrorResponse): void {
        const validationErrors = error.error?.error as ArticleValidationError[];

        if (!Array.isArray(validationErrors)) {
            this.snackbar.open(
                error.error?.message ?? 'Please check your article details.',
                'Close',
            );

            return;
        }

        validationErrors.forEach((validationError) => {
            const control = this.articleForm.get(validationError.field);

            if (!control) {
                return;
            }

            control.setErrors({
                ...control.errors,
                backend: validationError.message,
            });

            control.markAsTouched();
        });
    }

    private createShortDescription(description: string): string {
        const parser = new DOMParser();

        const document = parser.parseFromString(description, 'text/html');

        const plainText = (document.body.textContent ?? '')
            .replace(/&nbsp;/gi, ' ')
            .replace(/\u00a0/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        return plainText.length > 160 ? `${plainText.slice(0, 157)}...` : plainText;
    }
}
