import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { isAuthenticated } from './auth/state/auth.selector';
import { AuthState } from './auth/state/auth.state';
import { Header } from './header/header';

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
}
