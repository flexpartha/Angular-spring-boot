import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { loginStart } from '../state/auth.action';
import { AuthState } from '../state/auth.state';
import { getAuthMessage } from '../state/auth.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private store = inject(Store<AuthState>);
  private fb = inject(FormBuilder);
  authMsg$!: Observable<{ message: string | null, statusCode: number | null }>;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.authMsg$ = this.store.select(getAuthMessage);
    // this.authMsg$.subscribe(({ message, statusCode }) => {
    //   console.log('Auth message:', message, 'Status code:', statusCode);
    //   if (message) console.log(`[${statusCode}] ${message}`);
    // });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.store.dispatch(loginStart({ username: this.loginForm.value.username!, email: this.loginForm.value.email! }));
  }
}
