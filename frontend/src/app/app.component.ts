import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, LoaderComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {}
