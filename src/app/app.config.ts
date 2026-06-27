import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, InjectionToken, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { authInterceptorInterceptor } from './auth/service/auth-interceptor-interceptor';
import { errorInterceptor } from './auth/service/error-interceptor';
import { AppReducer } from './store/app.state';
import { AuthEffects } from './auth/state/auth.effects';
import { refreshFail, refreshStart } from './auth/state/auth.action';
import { provideOAuthClient, OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { initAuth } from './auth/init-auth';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

// export const googleAuthConfig: AuthConfig = {
//   issuer: 'https://accounts.google.com',
//   redirectUri: window.location.origin,
//   clientId: '862897604339-p9pkrknk2jojoq5rt75vfcqipup0q01h.apps.googleusercontent.com',
//   scope: 'openid profile email',
//   responseType: 'code',
//   oidc: true,
//   strictDiscoveryDocumentValidation: false,
//   skipIssuerCheck: true,
//   clearHashAfterLogin: false,
//   useSilentRefresh: false,
// };

// function initAuth() {
//   const store = inject(Store);
//   const oauthService = inject(OAuthService);
//   return async () => {
//     oauthService.configure(googleAuthConfig);
//     oauthService.setStorage(sessionStorage);
//     try {
//       await oauthService.loadDiscoveryDocument('https://accounts.google.com/.well-known/openid-configuration');
//       await oauthService.tryLoginCodeFlow();
//     } catch (_) {
//       // discovery failure should not block the app
//     }
//     if (sessionStorage.getItem('loggedIn')) {
//       store.dispatch(refreshStart({ silent: true }));
//     } else {
//       store.dispatch(refreshFail({ error: '' }));
//     }
//   };
// }

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptorInterceptor, errorInterceptor])),
    provideStore(AppReducer),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(AuthEffects),
    { provide: API_BASE_URL, useValue: '/api' },
    { provide: APP_INITIALIZER, useFactory: initAuth, multi: true },
    provideOAuthClient({
      resourceServer: {
        allowedUrls: ['/api'],
        sendAccessToken: false,
      }
    }),
  ]
};
