import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    private readonly snackBar = inject(MatSnackBar);

    open(message: string, action: string, config?: MatSnackBarConfig): void {
        this.snackBar.open(message, action, config);
    }
}
