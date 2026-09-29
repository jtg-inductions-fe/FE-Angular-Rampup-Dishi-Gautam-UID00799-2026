import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, LoaderComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {
    protected readonly routePaths = ROUTE_PATHS;
    constructor(protected readonly router: Router) {}
}
