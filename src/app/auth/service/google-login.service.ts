import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { map, Observable, tap } from 'rxjs';
import { User } from '../models/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class GoogleLoginService {
  private http = inject(HttpClient);
  private oauthService = inject(OAuthService);
  private  snackBar = inject(MatSnackBar);
   exchangeCodeWithBackend(code: string): Observable<User> {
    const verifierValue =
        sessionStorage.getItem('PKCE_verifier') ||
        sessionStorage.getItem('codeVerifier');

        if (!verifierValue) {
        // Fail fast – without the verifier Google will reject the token request.
        this.snackBar.open('PKCE verifier not found in sessionStorage', 'Close', { duration: 3000, panelClass: ['snack-error'] });
      }
    return this.http
      .post<User>('/api/auth/google', { code, verifierValue })
      .pipe(
        tap(() => {
          this.oauthService.setupAutomaticSilentRefresh();
        })
      );
  }
}
