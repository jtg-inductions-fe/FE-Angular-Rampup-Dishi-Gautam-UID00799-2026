import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, RouterLink],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
    protected readonly routePaths = ROUTE_PATHS;
}
