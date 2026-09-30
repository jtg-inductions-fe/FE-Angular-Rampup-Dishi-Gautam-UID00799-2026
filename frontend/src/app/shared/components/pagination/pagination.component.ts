import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
    readonly currentPage = input(1);
    readonly totalPages = input(1);

    readonly pageChange = output<number>();

    protected readonly pages = computed(() => {
        const total = this.totalPages();
        const current = this.currentPage();

        if (total <= 5) {
            return Array.from({ length: total }, (_, index) => index + 1);
        }

        if (current <= 3) {
            return [1, 2, 3, 4, 5];
        }

        if (current >= total - 2) {
            return [total - 4, total - 3, total - 2, total - 1, total];
        }

        return [current - 2, current - 1, current, current + 1, current + 2];
    });

    protected goToPage(page: number): void {
        if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
            return;
        }

        this.pageChange.emit(page);
    }

    protected previousPage(): void {
        this.goToPage(this.currentPage() - 1);
    }

    protected nextPage(): void {
        this.goToPage(this.currentPage() + 1);
    }
}
