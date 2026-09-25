import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { authInterceptor } from './core/interceptors/auth.interceptors';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),

        provideHttpClient(
            withInterceptors([
                authInterceptor,
                loadingInterceptor,
                errorInterceptor,
            ]),
        ),

        provideAnimationsAsync(),
    ],
};