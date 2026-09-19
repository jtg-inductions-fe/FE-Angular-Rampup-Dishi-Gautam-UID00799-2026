import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import {
    ApiResponse,
    LoginData,
    LoginRequest,
    RegisterRequest,
    User,
} from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly apiUrl = 'http://localhost:3000/api/v1';
    private readonly tokenKey = 'folio_token';

    private readonly currentUserSubject =
        new BehaviorSubject<User | null>(null);

    readonly currentUser$ = this.currentUserSubject.asObservable();

    readonly isAuthenticated = signal<boolean>(
        !!localStorage.getItem(this.tokenKey),
    );

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
    ) {}

    register(
        registerData: RegisterRequest,
    ): Observable<ApiResponse<User>> {
        return this.http.post<ApiResponse<User>>(
            `${this.apiUrl}/users/register`,
            registerData,
        );
    }

    login(loginData: LoginRequest): Observable<ApiResponse<LoginData>> {
        return this.http
            .post<ApiResponse<LoginData>>(
                `${this.apiUrl}/users/login`,
                loginData,
            )
            .pipe(
                tap((response) => {
                    const token = response.data.token;
                    const user = response.data.user;

                    localStorage.setItem(this.tokenKey, token);

                    this.currentUserSubject.next(user);
                    this.isAuthenticated.set(true);
                }),
            );
    }

    getProfile(): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(
            `${this.apiUrl}/users/profile`,
        );
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    logout ():void{
        localStorage.removeItem(this.tokenKey);
        this.currentUserSubject.next(null);
        this.isAuthenticated.set(false);
        this.router.navigate(['/login'])
    }

}