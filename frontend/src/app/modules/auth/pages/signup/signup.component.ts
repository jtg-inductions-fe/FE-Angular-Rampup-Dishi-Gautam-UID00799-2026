import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

import { passwordMatchValidator } from './password-validator';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        RouterLink,
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
})
export class SignupComponent {
    readonly signupForm = this.formBuilder.group(
        {
            [AUTH_FORM_FIELDS.USERNAME]: this.formBuilder.control('', {
                validators: [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(50),
                ],
            }),

            [AUTH_FORM_FIELDS.EMAIL]: this.formBuilder.control('', {
                validators: [Validators.required, Validators.email, Validators.maxLength(254)],
            }),

            [AUTH_FORM_FIELDS.PASSWORD]: this.formBuilder.control('', {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(128),
                    Validators.pattern(/^(?=(?:.*\d){2,})(?=(?:.*[^A-Za-z0-9]){2,}).+$/),
                ],
            }),

            [AUTH_FORM_FIELDS.CONFIRM_PASSWORD]: this.formBuilder.control('', {
                validators: Validators.required,
            }),
        },
        {
            validators: passwordMatchValidator,
        },
    );

    protected readonly routePaths = ROUTE_PATHS;
    isSubmitting = false;
    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly formBuilder: NonNullableFormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly snackbarService: SnackbarService,
    ) {}

    onSubmit(): void {
        if (this.signupForm.invalid) {
            this.signupForm.markAllAsTouched();
            return;
        }

        const { username, email, password } = this.signupForm.getRawValue();

        this.isSubmitting = true;

        this.authService
            .register({
                username,
                email,
                password,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.isSubmitting = false;
                    this.snackbarService.success(AUTH_MESSAGES.SIGNUP_SUCCESS);
                    this.router.navigate([this.routePaths.login]);
                },

                error: (error) => {
                    this.isSubmitting = false;
                    this.snackbarService.error(error.error?.message ?? AUTH_MESSAGES.SIGNUP_ERROR);
                },
            });
    }
}
