import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { OAuthService } from "angular-oauth2-oidc";
import { googleAuthConfig } from "./google-auth.config";
import { refreshFail, refreshStart } from "./state/auth.action";

export function initAuth() {
  const store = inject(Store);
  const oauthService = inject(OAuthService);
  return async () => {
    oauthService.configure(googleAuthConfig);
    oauthService.setStorage(sessionStorage);
    try {
      await oauthService.loadDiscoveryDocument('https://accounts.google.com/.well-known/openid-configuration');
      // oauthService.tryLoginCodeFlow() is omitted; token exchange is handled server‑side in GoogleCallback.
    } catch (_) {
      // discovery failure should not block the app
    }

    const url = new URL(window.location.href);
    const hasGoogleCallback = url.pathname.includes('/auth/callback');
    const hasAuthCode = url.searchParams.get('code') !== null;
    // If we're not on the explicit callback path and there's no auth code
    // in the query string, it's safe to clear any leftover PKCE verifier.
    if (!hasGoogleCallback && !hasAuthCode) {
      // These are the keys the library (and our own service) use
      sessionStorage.removeItem('PKCE_verifier');
      sessionStorage.removeItem('codeVerifier');
    }

    if (sessionStorage.getItem('loggedIn')) {
      store.dispatch(refreshStart({ silent: true }));
    } else {
      store.dispatch(refreshFail({ error: '' }));
    }
  };
}