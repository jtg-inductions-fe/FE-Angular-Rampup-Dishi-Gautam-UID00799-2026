import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent,LoaderComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {
    title = 'project';
    
}