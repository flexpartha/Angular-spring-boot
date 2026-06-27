import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Userlist } from './userlist';
import * as UserActions from '../state/user.action';
import {
  getUsers,
  getUserLoading,
  getUserError,
  getUserSuccessMessage,
} from '../state/user.selector';
import { User } from '../models/user-list.interface';

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Alice Smith',
    username: 'alice',
    email: 'alice@example.com',
    phone: '111-111',
    website: 'alice.com',
    address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
    company: { name: '', catchPhrase: '', bs: '' },
  },
  {
    id: 2,
    name: 'Bob Jones',
    username: 'bob',
    email: 'bob@example.com',
    phone: '222-222',
    website: 'bob.com',
    address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
    company: { name: '', catchPhrase: '', bs: '' },
  },
];

const mockSnackBar = { open: vi.fn().mockReturnValue({ onAction: () => ({ subscribe: vi.fn() }) }) };
const mockRouter = { navigate: vi.fn() };

describe('Userlist', () => {
  let component: Userlist;
  let fixture: ComponentFixture<Userlist>;
  let store: MockStore;
  let router: Router;
  let snackBar: MatSnackBar;

  let mockGetUsers: MemoizedSelector<object, User[]>;
  let mockGetLoading: MemoizedSelector<object, boolean>;
  let mockGetError: MemoizedSelector<object, string | null>;
  let mockGetSuccess: MemoizedSelector<object, string | null>;

  beforeEach(async () => {
    mockSnackBar.open.mockClear();
    mockRouter.navigate.mockClear();

    await TestBed.configureTestingModule({
      imports: [Userlist, NoopAnimationsModule],
      providers: [
        provideMockStore(),
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);

    mockGetUsers = store.overrideSelector(getUsers, []);
    mockGetLoading = store.overrideSelector(getUserLoading, false);
    mockGetError = store.overrideSelector(getUserError, null);
    mockGetSuccess = store.overrideSelector(getUserSuccessMessage, null);

    fixture = TestBed.createComponent(Userlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => store.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadUsers on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(UserActions.loadUsers());
  });

  it('should have correct displayedColumns', () => {
    expect(component.displayedColumns).toEqual(['id', 'name', 'username', 'email', 'phone', 'website', 'actions']);
  });

  it('should initialize with default signal values', () => {
    expect(component.pageIndex()).toBe(0);
    expect(component.pageSize()).toBe(5);
    expect(component.sortBy()).toBe('asc');
    expect(component.sortColumn()).toBe('id');
    expect(component.searchTerm()).toBe('');
  });

  describe('filteredUsers', () => {
    beforeEach(() => {
      mockGetUsers.setResult(mockUsers);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should return all users when no search term', () => {
      expect(component.filteredUsers().length).toBe(2);
    });

    it('should filter by name', () => {
      component.onSearch('alice');
      expect(component.filteredUsers().length).toBe(1);
      expect(component.filteredUsers()[0].name).toBe('Alice Smith');
    });

    it('should filter by email', () => {
      component.onSearch('bob@example');
      expect(component.filteredUsers().length).toBe(1);
      expect(component.filteredUsers()[0].username).toBe('bob');
    });

    it('should reset pageIndex to 0 on search', () => {
      component.pageIndex.set(2);
      component.onSearch('alice');
      expect(component.pageIndex()).toBe(0);
    });

    it('should sort ascending by id by default', () => {
      const ids = component.filteredUsers().map((u) => u.id);
      expect(ids).toEqual([1, 2]);
    });

    it('should sort descending when sortBy is desc', () => {
      component.onSort({ active: 'id', direction: 'desc' });
      const ids = component.filteredUsers().map((u) => u.id);
      expect(ids).toEqual([2, 1]);
    });
  });

  describe('paginatedUsers', () => {
    it('should paginate correctly', () => {
      mockGetUsers.setResult(mockUsers);
      store.refreshState();
      component.pageSize.set(1);
      component.pageIndex.set(0);
      expect(component.paginatedUsers().length).toBe(1);
      expect(component.paginatedUsers()[0].id).toBe(1);
    });

    it('should return second page', () => {
      mockGetUsers.setResult(mockUsers);
      store.refreshState();
      component.pageSize.set(1);
      component.pageIndex.set(1);
      expect(component.paginatedUsers()[0].id).toBe(2);
    });
  });

  describe('totalItems', () => {
    it('should reflect filtered count', () => {
      mockGetUsers.setResult(mockUsers);
      store.refreshState();
      expect(component.totalItems()).toBe(2);
      component.onSearch('alice');
      expect(component.totalItems()).toBe(1);
    });
  });

  describe('onPageChange', () => {
    it('should update pageIndex and pageSize', () => {
      component.onPageChange({ pageIndex: 2, pageSize: 10, length: 100 });
      expect(component.pageIndex()).toBe(2);
      expect(component.pageSize()).toBe(10);
    });
  });

  describe('onSort', () => {
    it('should update sortColumn and sortBy', () => {
      component.onSort({ active: 'name', direction: 'desc' });
      expect(component.sortColumn()).toBe('name');
      expect(component.sortBy()).toBe('desc');
    });

    it('should not update when direction is empty', () => {
      component.onSort({ active: 'name', direction: '' });
      expect(component.sortColumn()).toBe('id');
    });
  });

  describe('editUser', () => {
    it('should dispatch selectUser and navigate', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      component.editUser(mockUsers[0]);
      expect(dispatchSpy).toHaveBeenCalledWith(UserActions.selectUser({ user: mockUsers[0] }));
      expect(router.navigate).toHaveBeenCalledWith(['/userlist/edit', 1]);
    });
  });

  describe('addNewUser', () => {
    it('should dispatch clearSelectedUser and navigate', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      component.addNewUser();
      expect(dispatchSpy).toHaveBeenCalledWith(UserActions.clearSelectedUser());
      expect(router.navigate).toHaveBeenCalledWith(['/userlist/add']);
    });
  });

  describe('deleteUser', () => {
    it('should open snackbar confirmation', () => {
      const snackBarSpy = vi.spyOn(component['snackBar'], 'open').mockReturnValue({ onAction: () => ({ subscribe: vi.fn() }) } as any);
      component.deleteUser(1);
      expect(snackBarSpy).toHaveBeenCalledWith(
        'Are you sure you want to delete this user?',
        'Delete',
        expect.objectContaining({ duration: 5000 })
      );
    });
  });

  describe('store selectors', () => {
    it('should reflect loading state', () => {
      mockGetLoading.setResult(true);
      store.refreshState();
      expect(component.loading()).toBe(true);
    });

    it('should reflect error state', () => {
      mockGetError.setResult('Some error');
      store.refreshState();
      expect(component.error()).toBe('Some error');
    });
  });
});
