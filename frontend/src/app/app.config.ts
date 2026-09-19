import { ApplicationConfig } from '@angular/core';
import {
    provideHttpClient,
    withInterceptors,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { loadingInterceptor } from '@core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),

        provideHttpClient(
            withInterceptors([
               
                loadingInterceptor,
            ]),
        ),

        provideAnimationsAsync(),
    ],
};