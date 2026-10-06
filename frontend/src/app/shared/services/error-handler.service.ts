import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { DialogData } from '@app/core/models/dialog.model';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlerService {
    private readonly dialog = inject(MatDialog);

    handle(error: HttpErrorResponse): void {
        const dialogData = this.createDialogData(error);

        this.dialog.open(DialogComponent, {
            width: '420px',
            maxWidth: 'calc(100vw - 32px)',
            data: dialogData,
        });
    }

    private createDialogData(error: HttpErrorResponse): DialogData {
        return {
            title: this.getTitle(error.status),
            message: this.getMessage(error),
            confirmText: 'Close',
        };
    }

    private getTitle(status: number): string {
        if (status === 400) {
            return 'Invalid request';
        }

        if (status === 401) {
            return 'Authentication required';
        }

        if (status === 403) {
            return 'Access denied';
        }

        if (status === 404) {
            return 'Not found';
        }

        if (status === 409) {
            return 'Conflict';
        }

        if (status === 429) {
            return 'Too many requests';
        }

        if (status >= 500) {
            return 'Server error';
        }

        return 'Something went wrong';
    }

    private getMessage(error: HttpErrorResponse): string {
        const backendMessage = this.extractBackendMessage(error.error);

        if (backendMessage) {
            return backendMessage;
        }

        return this.getDefaultMessage(error.status);
    }

    private extractBackendMessage(backendError: unknown): string | null {
        if (!backendError) {
            return null;
        }

        if (typeof backendError === 'string') {
            return backendError;
        }

        if (typeof backendError !== 'object') {
            return null;
        }

        const errorObject = backendError as Record<string, unknown>;

        const message = errorObject['message'];

        if (typeof message === 'string') {
            return message;
        }

        const error = errorObject['error'];

        if (typeof error === 'string') {
            return error;
        }

        if (Array.isArray(error)) {
            const messages = error
                .map((item) => this.extractArrayMessage(item))
                .filter((message): message is string => Boolean(message));

            if (messages.length > 0) {
                return messages.join('\n');
            }
        }

        return null;
    }

    private extractArrayMessage(value: unknown): string | null {
        if (typeof value === 'string') {
            return value;
        }

        if (typeof value === 'object' && value !== null) {
            const item = value as Record<string, unknown>;

            if (typeof item['message'] === 'string') {
                return item['message'];
            }
        }

        return null;
    }

    private getDefaultMessage(status: number): string {
        if (status === 0) {
            return 'Unable to connect to the server. Please check your internet connection.';
        }

        if (status === 400) {
            return 'The request contains invalid information.';
        }

        if (status === 401) {
            return 'Your session is invalid or has expired. Please login again.';
        }

        if (status === 403) {
            return 'You do not have permission to perform this action.';
        }

        if (status === 404) {
            return 'The requested resource could not be found.';
        }

        if (status === 409) {
            return 'The request conflicts with existing data.';
        }

        if (status === 429) {
            return 'Too many requests. Please try again later.';
        }

        if (status >= 500) {
            return 'The server encountered an unexpected error. Please try again later.';
        }

        return 'An unexpected error occurred. Please try again.';
    }
}
