import { Component, OnChanges, SimpleChanges, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface ArticleFilterValue {
    author: string;
    tags: string;
}

@Component({
    selector: 'app-article-filter',
    standalone: true,
    imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
    templateUrl: './article-filter.component.html',
    styleUrl: './article-filter.component.scss',
})
export class ArticleFilterComponent implements OnChanges {
    readonly author = input('');
    readonly tags = input('');

    readonly apply = output<ArticleFilterValue>();

    readonly clear = output<void>();

    protected readonly authorControl = new FormControl('', {
        nonNullable: true,
        validators: [Validators.maxLength(100)],
    });

    protected readonly tagsControl = new FormControl('', {
        nonNullable: true,
        validators: [Validators.maxLength(200)],
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['author']) {
            this.authorControl.setValue(this.author(), {
                emitEvent: false,
            });
        }

        if (changes['tags']) {
            this.tagsControl.setValue(this.tags(), {
                emitEvent: false,
            });
        }
    }

    protected applyFilters(): void {
        if (this.authorControl.invalid || this.tagsControl.invalid) {
            this.authorControl.markAsTouched();
            this.tagsControl.markAsTouched();
            return;
        }

        this.apply.emit({
            author: this.authorControl.value.trim(),
            tags: this.tagsControl.value.trim(),
        });
    }

    protected clearFilters(): void {
        this.authorControl.setValue('');
        this.tagsControl.setValue('');

        this.clear.emit();
    }
}
