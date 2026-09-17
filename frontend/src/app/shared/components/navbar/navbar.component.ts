import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-navbar',
    standalone: true,
    
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        RouterLink,
        MatIconModule,MatMenuModule
    ],
    
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})


export class NavbarComponent {}