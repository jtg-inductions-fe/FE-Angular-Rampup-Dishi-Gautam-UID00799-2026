import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillModule } from 'ngx-quill';
import { ArticleService } from '@app/core/services/article.service';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
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
        title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
        shortDescription: [''],
        description: ['', [Validators.required, this.minPlainTextLength(50)]],
        image: ['', Validators.required],
        tags: [[] as string[], Validators.required],
    });

    protected isSubmitting = false;
    protected tagInput = '';
    private readonly articleService = inject(ArticleService);
    private readonly dialog = inject(MatDialog);
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
                this.articleForm.controls.image.markAsTouched();
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

        const tags = this.articleForm.controls.tags.value ?? [];

        if (tags.includes(tag)) {
            this.tagInput = '';
            return;
        }
        this.articleForm.controls.tags.setValue([...tags, tag]);
        this.articleForm.controls.tags.markAsTouched();
        this.tagInput = '';
    }

    removeTag(tagToRemove: string): void {
        const tags = this.articleForm.controls.tags.value ?? [];
        this.articleForm.controls.tags.setValue(tags.filter((tag) => tag !== tagToRemove));
        this.articleForm.controls.tags.updateValueAndValidity();
    }

    onSubmit(): void {
        this.articleForm.markAllAsTouched();
        if (this.articleForm.invalid || this.isSubmitting) {
            return;
        }
        this.isSubmitting = true;
        const formValue = this.articleForm.getRawValue();
        const description = formValue.description ?? '';
        this.articleService
            .createArticle({
                title: formValue.title ?? '',
                shortDescription: this.createShortDescription(description),
                description,
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

        this.openErrorDialog(
            error.error?.message ?? 'Something went wrong while creating the article.',
        );
    }

    private setBackendValidationErrors(error: HttpErrorResponse): void {
        const validationErrors = error.error?.error as ArticleValidationError[] | undefined;

        if (!Array.isArray(validationErrors)) {
            this.openErrorDialog(error.error?.message ?? 'Please check your article details.');
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

    private openErrorDialog(message: string): void {
        this.dialog.open(DialogComponent, {
            width: '400px',
            data: {
                title: 'Unable to create article',
                message,
                confirmText: 'Close',
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

    private createShortDescription(description: string): string {
        const plainText = this.getPlainText(description);
        return plainText.length > 160 ? `${plainText.slice(0, 157)}...` : plainText;
    }
}
