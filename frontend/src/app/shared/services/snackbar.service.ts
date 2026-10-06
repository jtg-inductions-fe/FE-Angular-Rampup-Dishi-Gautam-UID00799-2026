import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    private readonly snackBar = inject(MatSnackBar);

    success(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
        });
    }

    error(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
        });
    }
}