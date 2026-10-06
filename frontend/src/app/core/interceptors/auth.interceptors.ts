import { HttpInterceptorFn } from '@angular/common/http';
import { APP_CONSTANTS } from '@app/shared/constants/app.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem(APP_CONSTANTS.storageKeys.authToken);
    if (!token) {
        return next(req);
    }
    return next(
        req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        }),
    );
};
