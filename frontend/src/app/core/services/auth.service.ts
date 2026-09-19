import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { User } from '@app/core/models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { LoginData, LoginRequest, RegisterRequest } from '../models/auth.model';

import { UserService } from '@app/core/services/user.service';
import { APP_CONSTANTS } from '@app/shared/constants/app.constants';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    readonly isAuthenticated = signal(!!localStorage.getItem(APP_CONSTANTS.storageKeys.authToken));

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
        private readonly userService: UserService,
    ) {
        this.restoreSession();
    }

    register(registerData: RegisterRequest): Observable<ApiResponse<User>> {
        return this.http.post<ApiResponse<User>>(
            `${APP_CONSTANTS.apiUrl}/users/register`,
            registerData,
        );
    }

    login(loginData: LoginRequest): Observable<ApiResponse<LoginData>> {
        return this.http
            .post<ApiResponse<LoginData>>(`${APP_CONSTANTS.apiUrl}/users/login`, loginData)
            .pipe(
                tap((response) => {
                    const { token, user } = response.data;

                    localStorage.setItem(APP_CONSTANTS.storageKeys.authToken, token);

                    this.userService.setUser(user);
                    this.isAuthenticated.set(true);
                }),
            );
    }

    getToken(): string | null {
        return localStorage.getItem(APP_CONSTANTS.storageKeys.authToken);
    }

    logout(): void {
        localStorage.removeItem(APP_CONSTANTS.storageKeys.authToken);
        this.userService.clearUser();
        this.isAuthenticated.set(false);
        this.router.navigate([ROUTE_PATHS.login]);
    }

    private restoreSession(): void {
        const token = this.getToken();
        if (!token) {
            return;
        }
        this.userService.getProfile().subscribe({
            next: (response) => {
                this.userService.setUser(response.data);
                this.isAuthenticated.set(true);
            },
            error: () => {
                this.logout();
            },
        });
    }
}