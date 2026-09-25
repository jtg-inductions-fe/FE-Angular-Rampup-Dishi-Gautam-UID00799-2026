import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    ActivatedRoute,
    Router,
    RouterLink,
} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillModule } from 'ngx-quill';

import { ArticleService } from '@app/core/services/article.service';
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
        QuillModule,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: './update-article.component.html',
    styleUrl: './update-article.component.scss',
})
export class UpdateArticleComponent implements OnInit {
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

    protected isLoading = false;
    protected isSubmitting = false;
    protected tagInput = '';

    private articleId = '';

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly articleService = inject(ArticleService);
    private readonly snackbar = inject(SnackbarService);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            return;
        }

        this.articleId = id;
        this.loadArticle();
    }

    onImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                this.articleForm.controls.image.setValue(reader.result);
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

        this.articleForm.controls.tags.setValue([
            ...currentTags,
            tag,
        ]);

        this.tagInput = '';
    }

    removeTag(tagToRemove: string): void {
        const currentTags = this.articleForm.controls.tags.value ?? [];

        this.articleForm.controls.tags.setValue(
            currentTags.filter((tag) => tag !== tagToRemove),
        );

        this.articleForm.controls.tags.markAsDirty();
    }

    onSubmit(): void {
        if (this.articleForm.invalid || this.isSubmitting) {
            this.articleForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;

        const formValue = this.articleForm.getRawValue();

        const shortDescription = this.createShortDescription(
            formValue.description ?? '',
        );

        this.articleService
            .updateArticle(this.articleId, {
                title: formValue.title ?? '',
                shortDescription,
                description: formValue.description ?? '',
                image: formValue.image ?? '',
                tags: formValue.tags ?? [],
            })
            .subscribe({
                next: () => {
                    this.isSubmitting = false;

                    this.snackbar.open(
                        'Article updated successfully',
                        'Close',
                    );

                    this.router.navigate([
                        this.routePaths.dashboard,
                    ]);
                },
                error: () => {
                    this.isSubmitting = false;

                    this.snackbar.open(
                        'Unable to update article',
                        'Close',
                    );
                },
            });
    }

    private loadArticle(): void {
        this.isLoading = true;

        this.articleService.getArticle(this.articleId).subscribe({
            next: (article) => {
                this.articleForm.patchValue({
                    title: article.title,
                    description: article.description,
                    image: article.image,
                    tags: article.tags,
                });

                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;

                this.snackbar.open(
                    'Unable to load article',
                    'Close',
                );

                this.router.navigate([
                    this.routePaths.dashboard,
                ]);
            },
        });
    }

    private createShortDescription(description: string): string {
        const parser = new DOMParser();
        const document = parser.parseFromString(
            description,
            'text/html',
        );

        const plainText = (document.body.textContent ?? '')
            .replace(/\u00a0/g, ' ')
            .replace(/&nbsp;/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        return plainText.length > 160
            ? `${plainText.slice(0, 157)}...`
            : plainText;
    }
}