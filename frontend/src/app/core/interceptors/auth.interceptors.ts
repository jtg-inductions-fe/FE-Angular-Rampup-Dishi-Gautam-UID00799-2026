import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@app/environments/enviornments';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem(environment.storageKeys.authToken);

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
