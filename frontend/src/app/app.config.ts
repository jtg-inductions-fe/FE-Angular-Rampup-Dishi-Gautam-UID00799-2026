import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './core/interceptors/auth.interceptors';
import { loadingInterceptor } from '@core/interceptors/loading.interceptor';
import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),

        provideHttpClient(withInterceptors([loadingInterceptor, errorInterceptor])),

        provideAnimationsAsync(),
        provideHttpClient(withInterceptors([authInterceptor])),

    ],
};
