import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { AuthService } from '@app/core/services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        RouterLink,
        MatIconModule,
        MatMenuModule,
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    protected readonly routePaths = ROUTE_PATHS;
    private readonly authService = inject(AuthService);
    readonly isAuthenticated = this.authService.isAuthenticated;

    logout(): void {
        this.authService.logout();
    }
}
