import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { isAuthenticated } from './auth/state/auth.selector';
import { AuthState } from './auth/state/auth.state';
import { Header } from './header/header';
import { googleLoginStart, loginSuccess } from './auth/state/auth.action';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private store = inject(Store<AuthState>);
  isAuthenticated$ = this.store.select(isAuthenticated);
  private router = inject(Router);
  constructor() {
    // const token = localStorage.getItem('authToken');
    // const refreshToken = localStorage.getItem('refreshToken');

    // if (token) {
    //   this.store.dispatch(loginSuccess({
    //     user: { accessToken: token, refreshToken: refreshToken ?? undefined },
    //     redirect: false,
    //     statusCode: 200
    //   }));
    // }

    const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
    
          if (code) {
            // This will trigger the effect chain we are about to add.
            this.store.dispatch(googleLoginStart({ code }));
          } else {
            // No code – something went wrong, send the user back to the login page.
            this.router.navigate(['/login']);
          }
  }
}
