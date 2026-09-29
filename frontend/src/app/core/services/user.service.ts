import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {  User } from '@app/core/models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { APP_CONSTANTS } from '@app/shared/constants/app.constants';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    readonly currentUser = signal<User | null>(null);
    constructor(private readonly http: HttpClient) {}

    getProfile(): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${APP_CONSTANTS.apiUrl}/users/profile`);
    }

    getUser(): User | null {
        return this.currentUser();
    }

    setUser(user: User): void {
        this.currentUser.set(user);
    }

    clearUser(): void {
        this.currentUser.set(null);
    }
}
