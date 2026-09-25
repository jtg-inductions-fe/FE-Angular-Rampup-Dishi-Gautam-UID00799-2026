import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiErrorHandlerService } from '@app/shared/services/error-handler.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
    const errorHandler = inject(ApiErrorHandlerService);

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            errorHandler.handle(error);

            return throwError(() => error);
        }),
    );
};
