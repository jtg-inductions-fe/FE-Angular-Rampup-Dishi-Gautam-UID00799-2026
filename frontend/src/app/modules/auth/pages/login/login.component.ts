import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@app/core/services/auth.service';
import { AUTH_FORM_FIELDS } from '@app/shared/constants/auth-form-fields';
import { AUTH_MESSAGES } from '@app/shared/constants/auth-error-messages';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { SnackbarService } from '@app/shared/services/snackbar.service';

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
    readonly loginForm = new FormGroup({
        [AUTH_FORM_FIELDS.USERNAME]: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
        }),

        [AUTH_FORM_FIELDS.PASSWORD]: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(8), Validators.maxLength(128)],
        }),
    });

    protected readonly routePaths = ROUTE_PATHS;

    isSubmitting = false;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly authService: AuthService,
        private readonly snackbarService: SnackbarService,
        private readonly router: Router,
    ) {}

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;

        this.authService
            .login(this.loginForm.getRawValue())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.isSubmitting = false;

                    this.snackbarService.success(AUTH_MESSAGES.LOGIN_SUCCESS);

                    this.router.navigate([this.routePaths.dashboard]);
                },

                error: (error) => {
                    this.isSubmitting = false;
                },
            });
    }
}
