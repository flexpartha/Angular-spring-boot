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

  isLoading$ = this.store.select(getAuthLoading);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.store.select(getAuthMessage)
      .pipe(filter(auth => !!auth.message))
      .subscribe(({ message, statusCode }) => {
        const panelClass = statusCode === 200 ? 'snack-success' : 'snack-error';
        this.snackBar.open(message ?? '', 'Close', { duration: 3000, panelClass });
      });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const { username, email } = this.loginForm.value;
    this.store.dispatch(loginStart({ username: username ?? '', email: email ?? '' }));
  }
}
