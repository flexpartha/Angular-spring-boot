import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppState } from '../../store/app.state';
import * as UserActions from '../state/user.action';
import {
  getUserLoading,
  getSelectedUser,
  getUserById,
} from '../state/user.selector';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-edituser',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edituser.html',
  styleUrl: './edituser.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Edituser implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  loading = toSignal(this.store.select(getUserLoading), {
    initialValue: false,
  });
  selectedUser = toSignal(this.store.select(getSelectedUser), {
    initialValue: null,
  });

  userForm: FormGroup;
  userId = signal<number | null>(null);

  constructor() {
    this.userForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      website: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        suite: [''],
        city: ['', Validators.required],
        zipcode: ['', Validators.required],
        geo: this.fb.group({
          lat: ['0'],
          lng: ['0'],
        }),
      }),
      company: this.fb.group({
        name: [''],
        catchPhrase: [''],
        bs: [''],
      }),
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const id = +params['id'];
      this.userId.set(id);

      const user = this.selectedUser();
      if (user) {
        this.userForm.patchValue(user);
      } else {
        // On refresh: store is empty, load users then patch form
        this.store.dispatch(UserActions.loadUsers());
        this.store.select(getUserById(id)).pipe(
          filter((u) => !!u),
          take(1)
        ).subscribe((u) => this.userForm.patchValue(u));
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid && this.userId()) {
      const userData = {
        ...this.userForm.getRawValue(),
      };
      this.store.dispatch(UserActions.updateUser({ user: userData }));
    }
  }

  onCancel() {
    this.router.navigate(['/userlist']);
  }
}


