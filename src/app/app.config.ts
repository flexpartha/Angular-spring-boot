import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { authInterceptorInterceptor } from './auth/service/auth-interceptor-interceptor';
import { errorInterceptor } from './auth/service/error-interceptor';
import { AppReducer } from './store/app.state';
import { AuthEffects } from './auth/state/auth.effects';
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptorInterceptor, errorInterceptor])),
    provideStore(AppReducer),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(AuthEffects),
    { provide: API_BASE_URL, useValue: '/api' }
  ]
};
