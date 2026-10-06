import { Injectable, signal,DestroyRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { User } from '@app/core/models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { LoginData, LoginRequest, RegisterRequest } from '../models/auth.model';

import { UserService } from '@app/core/services/user.service';
import { environment } from '@app/environments/enviornments';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly destroyRef=inject(DestroyRef)
    readonly isAuthenticated = signal(!!localStorage.getItem(environment.storageKeys.authToken));

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
        private readonly userService: UserService,
    ) {
        this.restoreSession();
    }

    register(registerData: RegisterRequest): Observable<ApiResponse<User>> {
        return this.http.post<ApiResponse<User>>(
            `${environment.apiUrl}/users/register`,
            registerData,
        );
    }

    login(loginData: LoginRequest): Observable<ApiResponse<LoginData>> {
        return this.http
            .post<ApiResponse<LoginData>>(`${environment.apiUrl}/users/login`, loginData)
            .pipe(
                tap((response) => {
                    const { token, user } = response.data;

                    localStorage.setItem(environment.storageKeys.authToken, token);

                    this.userService.setUser(user);
                    this.isAuthenticated.set(true);
                }),
            );
    }

    getToken(): string | null {
        return localStorage.getItem(environment.storageKeys.authToken);
    }

    logout(): void {
        localStorage.removeItem(environment.storageKeys.authToken);
        this.userService.clearUser();
        this.isAuthenticated.set(false);
        this.router.navigate([ROUTE_PATHS.login]);
    }

    private restoreSession(): void {
        const token = this.getToken();
        if (!token) {
            return;
        }
        this.userService.getProfile()
        .pipe(
            takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
            next:(response)=>{
                this.userService.setUser(response.data);
                this.isAuthenticated.set(true)
            },
            error:()=>{
                this.logout();
            }
            
        })
    }
}
