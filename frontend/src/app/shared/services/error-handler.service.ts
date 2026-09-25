import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '@app/core/models/dialog.model';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';

@Injectable({
    providedIn: 'root',
})
export class ApiErrorHandlerService {
    private readonly dialog = inject(MatDialog);

    handle(error: HttpErrorResponse): void {
        const dialogData = this.createDialogData(error);

        this.dialog.open(DialogComponent, {
            width: '420px',
            maxWidth: 'calc(100vw - 32px)',
            data: dialogData,
        });
    }

    private createDialogData(
        error: HttpErrorResponse,
    ): DialogData {
        const messages = this.extractMessages(error.error);

        return {
            title: this.getTitle(error.status),
            message:
                messages.length > 0
                    ? messages.join('\n')
                    : this.getDefaultMessage(error.status),
            confirmText: 'Close',
        };
    }

    private getTitle(status: number): string {
        switch (status) {
            case 400:
                return 'Invalid request';

            case 401:
                return 'Authentication required';

            case 403:
                return 'Access denied';

            case 404:
                return 'Not found';

            case 409:
                return 'Conflict';

            case 429:
                return 'Too many requests';

            default:
                return status >= 500
                    ? 'Server error'
                    : 'Something went wrong';
        }
    }

    private extractMessages(value: unknown): string[] {
        if (!value) {
            return [];
        }

        if (typeof value === 'string') {
            return [value];
        }

        if (Array.isArray(value)) {
            return this.extractArrayMessages(value);
        }

        if (typeof value !== 'object') {
            return [];
        }

        const object = value as Record<string, unknown>;

        const detailedMessages = this.extractDetailedMessages(
            object,
        );

        if (detailedMessages.length > 0) {
            return detailedMessages;
        }

        const message = this.getString(object['message']);

        return message ? [message] : [];
    }

    private extractArrayMessages(
        values: unknown[],
    ): string[] {
        const messages = values.flatMap((value) =>
            this.extractMessages(value),
        );

        return this.removeDuplicates(messages);
    }

    private extractDetailedMessages(
        object: Record<string, unknown>,
    ): string[] {
        const errors = object['errors'] ?? object['error'];

        if (!Array.isArray(errors)) {
            return [];
        }

        return this.removeDuplicates(
            errors
                .map((error) =>
                    this.formatValidationError(error),
                )
                .filter(
                    (message): message is string =>
                        message !== null,
                ),
        );
    }

    private formatValidationError(
        value: unknown,
    ): string | null {
        if (typeof value === 'string') {
            return value;
        }

        if (
            typeof value !== 'object' ||
            value === null
        ) {
            return null;
        }

        const error = value as Record<string, unknown>;

        const message = this.getString(error['message']);

        if (!message) {
            return null;
        }

        const field = this.getString(error['field']);

        if (!field) {
            return message;
        }

        return `${this.formatFieldName(field)}: ${message}`;
    }

    private formatFieldName(field: string): string {
        return field
            .replace(/([A-Z])/g, ' $1')
            .replace(/[_-]/g, ' ')
            .replace(/^./, (character) =>
                character.toUpperCase(),
            );
    }

    private getString(value: unknown): string | null {
        if (typeof value !== 'string') {
            return null;
        }

        const message = value.trim();

        return message.length > 0 ? message : null;
    }

    private removeDuplicates(
        messages: string[],
    ): string[] {
        return [...new Set(messages)];
    }

    private getDefaultMessage(status: number): string {
        switch (status) {
            case 0:
                return 'Unable to connect to the server. Please check your connection and try again.';

            case 400:
                return 'The request contains invalid information.';

            case 401:
                return 'Your session has expired. Please login again.';

            case 403:
                return 'You do not have permission to perform this action.';

            case 404:
                return 'The requested resource could not be found.';

            case 409:
                return 'The request conflicts with existing data.';

            case 429:
                return 'Too many requests. Please try again later.';

            default:
                return status >= 500
                    ? 'The server encountered an unexpected error. Please try again later.'
                    : 'An unexpected error occurred. Please try again.';
        }
    }
}