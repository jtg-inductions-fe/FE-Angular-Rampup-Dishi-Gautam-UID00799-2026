import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '@shared/services/loading.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [MatProgressSpinnerModule],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss',
})
export class LoaderComponent {
    private readonly loadingService = inject(LoadingService);

    readonly isLoading = this.loadingService.isLoading;
}