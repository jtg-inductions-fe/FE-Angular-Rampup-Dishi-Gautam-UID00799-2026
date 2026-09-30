import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

const SEARCH_DEBOUNCE_TIME = 400;

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
export class NavbarComponent implements OnInit {
    protected readonly routePaths = ROUTE_PATHS;

    protected readonly searchControl = new FormControl('', {
        nonNullable: true,
    });

    private readonly authService = inject(AuthService);
    protected readonly isAuthenticated = this.authService.isAuthenticated;
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    constructor() {
        this.searchControl.valueChanges
            .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged(), takeUntilDestroyed())
            .subscribe((search) => {
                this.searchArticles(search);
            });
    }

    ngOnInit(): void {
        this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
            const search = params.get('search') ?? '';

            this.restoreSearch(search);
        });
    }

    protected logout(): void {
        this.authService.logout();
    }

    private searchArticles(search: string): void {
        const searchValue = search.trim();

        if (searchValue.length > 0 && searchValue.length < 3) {
            return;
        }

        this.router.navigate(['/', ROUTE_PATHS.dashboard], {
            queryParams: {
                search: searchValue || null,
                page: 1,
            },
            queryParamsHandling: 'merge',
        });
    }

    private restoreSearch(search: string): void {
        this.searchControl.setValue(search, {
            emitEvent: false,
        });
    }
}
