import { AuthConfig } from 'angular-oauth2-oidc';

export const googleAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  //redirectUri: window.location.origin + '/auth/callback',
  redirectUri: window.location.origin,
  clientId: '862897604339-p9pkrknk2jojoq5rt75vfcqipup0q01h.apps.googleusercontent.com',
  scope: 'openid profile email',
  responseType: 'code',
  oidc: true,
  strictDiscoveryDocumentValidation: false,
  skipIssuerCheck: true,
  clearHashAfterLogin: false,
  useSilentRefresh: false,
};