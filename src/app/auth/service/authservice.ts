import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login.interface';
import { API_BASE_URL } from '../../app.config';
import { User } from '../models/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private _http = inject(HttpClient);
  private _baseUrl = inject(API_BASE_URL);
  private  snackBar = inject(MatSnackBar);

  login(username: string, email: string): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this._baseUrl}/auth/login`, { username, email });
  }

  refreshToken(silent: boolean): Observable<LoginResponse> {
    const token = sessionStorage.getItem('refreshToken');
    const headers: Record<string, string> = silent ? { 'X-Silent': 'true' } : {};
    return this._http.post<LoginResponse>(`${this._baseUrl}/auth/refresh`, { refreshToken: token }, { withCredentials: true, headers });
  }

  logout(): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this._baseUrl}/auth/logout`, {});
  }

  googleLogin(code: string): Observable<LoginResponse> {
    const verifier =
        sessionStorage.getItem('PKCE_verifier') ||
        sessionStorage.getItem('codeVerifier');
        if (!verifier) {
        // Fail fast – without the verifier Google will reject the token request.
        this.snackBar.open('PKCE verifier not found in sessionStorage', 'Close', { duration: 3000, panelClass: ['snack-error'] });
      }
    return this._http.post<LoginResponse>(`${this._baseUrl}/auth/google`, { code, codeVerifier: verifier });
  }
}
