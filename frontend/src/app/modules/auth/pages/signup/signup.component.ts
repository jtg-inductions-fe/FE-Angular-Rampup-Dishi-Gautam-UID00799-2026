import { Component } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { AuthService } from '@app/core/services/auth.service';
import { SnackbarService } from '@app/shared/services/snackbar.service';

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
    protected readonly routePaths = ROUTE_PATHS;
    readonly signupForm = new FormGroup(
        {
            username: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),

            email: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.email],
            }),

            password: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(/^(?=(?:.*\d){2,})(?=(?:.*[^A-Za-z0-9]){2,}).+$/),
                ],
            }),

            confirmPassword: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        },
        {
            validators: (
                control: AbstractControl,
            ): ValidationErrors | null => {
                const password =
                    control.get('password')?.value;

                const confirmPassword =
                    control.get('confirmPassword')?.value;

                if (!password || !confirmPassword) {
                    return null;
                }

                return password === confirmPassword ? null : { passwordMismatch: true };
            },
        },
    );

    isSubmitting = false;

    constructor(
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
            .signup({
                username,
                email,
                password,
            })
            .subscribe({
                next: () => {
                    this.isSubmitting = false;

                    this.snackbarService.open(
                        'Registration successful. Please login.',
                        'Close',
                    );

                    this.router.navigate(['/login']);
                },

                error: (error) => {
                    this.isSubmitting = false;

                    if (error.status === 409) {
                        this.snackbarService.open(
                            error.error?.message ??
                                'Username or email already exists.',
                            'Close',
                        );

                        return;
                    }

                    this.snackbarService.open(
                        error.error?.message ??
                            'Registration failed. Please try again.',
                        'Close',
                    );
                },
            });
    }
}
