import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { ApiResponse, LoginData, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly apiUrl = 'http://localhost:3000/api/v1';

    private readonly tokenKey = 'folio_token';

    private readonly currentUserSubject = new BehaviorSubject<User | null>(null);

    readonly currentUser$ = this.currentUserSubject.asObservable();

    readonly currentUser = signal<User | null>(null);

    readonly isAuthenticated = signal<boolean>(!!localStorage.getItem(this.tokenKey));

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
    ) {
        this.restoreSession();
    }

    signup(registerData: RegisterRequest): Observable<ApiResponse<User>> {
        return this.http.post<ApiResponse<User>>(`${this.apiUrl}/users/register`, registerData);
    }

    login(loginData: LoginRequest): Observable<ApiResponse<LoginData>> {
        return this.http.post<ApiResponse<LoginData>>(`${this.apiUrl}/users/login`, loginData).pipe(
            tap((response) => {
                const { token, user } = response.data;

                localStorage.setItem(this.tokenKey, token);

                this.setUser(user);
            }),
        );
    }

    getProfile(): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/profile`);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getUser(): User | null {
        return this.currentUserSubject.value;
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);

        this.currentUserSubject.next(null);
        this.currentUser.set(null);
        this.isAuthenticated.set(false);

        this.router.navigate(['/login']);
    }

    private restoreSession(): void {
        const token = this.getToken();

        if (!token) {
            return;
        }

        this.getProfile().subscribe({
            next: (response) => {
                this.setUser(response.data);
            },
            error: (error: HttpErrorResponse) => {
                console.error('Session restore failed:', error.status, error.error);
            },
        });
    }

    private setUser(user: User): void {
        this.currentUserSubject.next(user);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
    }
}
