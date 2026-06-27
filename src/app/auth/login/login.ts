import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { loginStart } from '../state/auth.action';
import { getAuthLoading, getAuthMessage } from '../state/auth.selector';
import { AuthState } from '../state/auth.state';
import { AsyncPipe } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private store = inject(Store<AuthState>);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oauthService = inject(OAuthService);

  isLoading$ = this.store.select(getAuthLoading);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {

   const url = new URL(window.location.href);
    const isGoogleCallback = url.pathname.includes('/auth/callback');
    const hasAuthCode = url.searchParams.get('code') !== null;

    // Preserve the PKCE verifier when Google has redirected back with an auth code.
    if (!isGoogleCallback && !hasAuthCode) {
      sessionStorage.removeItem('PKCE_verifier');
      sessionStorage.removeItem('codeVerifier');
    }

    this.store.select(getAuthMessage)
      .pipe(filter(auth => !!auth.message && !!auth.statusCode && auth.statusCode >= 200 && auth.statusCode < 300))
      .subscribe(({ message }) => {
        this.snackBar.open(message ?? '', 'Close', { duration: 3000, panelClass: ['snack-success'] });
      });

    // After redirect back from Google, extract user info and dispatch loginStart
    if (this.oauthService.hasValidIdToken()) {
      const claims = this.oauthService.getIdentityClaims() as { name?: string; email?: string };
      this.store.dispatch(loginStart({
        username: claims?.name ?? '',
        email: claims?.email ?? ''
      }));
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const { username, email } = this.loginForm.value;
    this.store.dispatch(loginStart({ username: username ?? '', email: email ?? '' }));
  }

  loginWithGoogle() {
    this.oauthService.initCodeFlow();
  }
}
