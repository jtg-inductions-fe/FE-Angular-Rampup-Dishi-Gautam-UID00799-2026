import { Component } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { AuthService } from '@app/core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        RouterLink,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    protected readonly routePaths = ROUTE_PATHS;
    readonly loginForm = new FormGroup({
        username: new FormControl('', {
            nonNullable: true,
            validators: Validators.required,
        }),

        password: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    isSubmitting = false;

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
    ) {}

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;

        this.authService.login(this.loginForm.getRawValue()).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.router.navigate(['/dashboard']);
            },
            error: () => {
                this.isSubmitting = false;
            },
        });
    }
}