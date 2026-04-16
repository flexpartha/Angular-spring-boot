import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { loginStart } from '../state/auth.action';
import { getAuthMessage } from '../state/auth.selector';
import { AuthState } from '../state/auth.state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private store = inject(Store<AuthState>);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

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
