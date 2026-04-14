import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { AppState } from '../../store/app.state';
import * as UserActions from '../state/user.action';
import {
  getUsers,
  getUserLoading,
  getUserError,
  getUserSuccessMessage,
} from '../state/user.selector';
import { User } from '../models/user-list.interface';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule,
  ],
  templateUrl: './userlist.html',
  styleUrl: './userlist.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Userlist implements OnInit {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  users = toSignal(this.store.select(getUsers), { initialValue: [] });
  loading = toSignal(this.store.select(getUserLoading), { initialValue: false });
  error = toSignal(this.store.select(getUserError), { initialValue: null });
  successMessage = toSignal(this.store.select(getUserSuccessMessage), {
    initialValue: null,
  });

  displayedColumns = [
    'id',
    'name',
    'username',
    'email',
    'phone',
    'website',
    'actions',
  ];

  pageIndex = signal(0);
  pageSize = signal(5);
  sortBy = signal<'asc' | 'desc'>('asc');
  sortColumn = signal<keyof User>('id');
  searchTerm = signal('');

  filteredUsers = computed(() => {
    let users = this.users();
    const search = this.searchTerm().toLowerCase();

    if (search) {
      users = users.filter(
        (user: User) =>
          user.name.toLowerCase().includes(search) ||
          user.username.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.phone.includes(search)
      );
    }

    // Sort
    const sortCol = this.sortColumn();
    const sortDir = this.sortBy();
    users = [...users].sort((a: User, b: User) => {
      const aVal = a[sortCol] as string | number;
      const bVal = b[sortCol] as string | number;
      const comparison =
        aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? comparison : -comparison;
    });

    return users;
  });

  paginatedUsers = computed(() => {
    const users = this.filteredUsers();
    const start = this.pageIndex() * this.pageSize();
    return users.slice(start, start + this.pageSize());
  });

  totalItems = computed(() => this.filteredUsers().length);

  constructor() {
    effect(() => {
      const msg = this.successMessage();
      if (msg) {
        this.snackBar.open(msg, 'Close', { duration: 3000 });
        this.store.dispatch(UserActions.clearMessages());
      }
    });

    effect(() => {
      const err = this.error();
      if (err) {
        this.snackBar.open(err, 'Close', { duration: 5000 });
        this.store.dispatch(UserActions.clearMessages());
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onSort(sort: Sort) {
    if (sort.active && sort.direction) {
      this.sortColumn.set(sort.active as keyof User);
      this.sortBy.set(sort.direction as 'asc' | 'desc');
    }
  }

  editUser(user: User) {
    this.store.dispatch(UserActions.selectUser({ user }));
    this.router.navigate(['/userlist/edit', user.id]);
  }

  deleteUser(id: number) {
    const snackRef = this.snackBar.open('Are you sure you want to delete this user?', 'Delete', {
      duration: 5000,
      panelClass: ['confirm-snackbar']
    });
    snackRef.onAction().subscribe(() => {
      this.store.dispatch(UserActions.deleteUser({ id }));
    });
  }

  addNewUser() {
    this.store.dispatch(UserActions.clearSelectedUser());
    this.router.navigate(['/userlist/add']);
  }
}



