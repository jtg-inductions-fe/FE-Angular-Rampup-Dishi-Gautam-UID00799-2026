import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { AuthService } from '@app/core/services/auth.service';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    protected readonly routePaths = ROUTE_PATHS;
    protected readonly searchControl = new FormControl('', {
        nonNullable: true,
    });
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    protected readonly isAuthenticated = this.authService.isAuthenticated;
    constructor() {
        this.restoreSearch();
        this.searchControl.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged())
            .subscribe((search) => {
                this.searchArticles(search);
            });
    }

    logout(): void {
        this.authService.logout();
    }

    private searchArticles(search: string): void {
        const searchValue = search.trim();
        if (searchValue.length > 0 && searchValue.length < 3) {
            return;
        }
        this.router.navigate([ROUTE_PATHS.dashboard], {
            queryParams: searchValue ? { search: searchValue } : {},
        });
    }

    private restoreSearch(): void {
        const search = this.route.snapshot.queryParamMap.get('search') ?? '';
        this.searchControl.setValue(search, {
            emitEvent: false,
        });
    }
}
