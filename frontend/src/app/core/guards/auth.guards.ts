import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { ROUTE_PATHS } from '@app/shared/constants/route-paths';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isAuthenticated()) {
        return true;
    }
    return router.createUrlTree([ROUTE_PATHS.login]);
};

export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isAuthenticated()) {
        return router.createUrlTree([ROUTE_PATHS.dashboard]);
    }
    return true;
};
