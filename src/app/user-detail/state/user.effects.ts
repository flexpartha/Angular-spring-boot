import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { UserService } from '../service/user-service';
import * as UserActions from './user.action';

@Injectable()
export class UserEffects {
    private actions$ = inject(Actions);
    private userService = inject(UserService);
    private store = inject(Store);
    private router = inject(Router);

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.loadUsers),
            exhaustMap(() =>
                this.userService.getUsers().pipe(
                    map((response) =>
                        UserActions.loadUsersSuccess({ users: response.data })
                    ),
                    catchError((error) =>
                        of(
                            UserActions.loadUsersFail({
                                error: error.error?.message || 'Failed to load users',
                            })
                        )
                    )
                )
            )
        )
    );

    addUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.addUser),
            exhaustMap((action) =>
                this.userService.createUser(action.user).pipe(
                    map((response) =>
                        UserActions.addUserSuccess({ user: response.data })
                    ),
                    catchError((error) =>
                        of(
                            UserActions.addUserFail({
                                error: error.error?.message || 'Failed to add user',
                            })
                        )
                    )
                )
            )
        )
    );

    addUserRedirect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(UserActions.addUserSuccess),
                tap(() => {
                    this.router.navigate(['/userlist']);
                })
            ),
        { dispatch: false }
    );

    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.updateUser),
            exhaustMap((action) =>
                this.userService.updateUser(action.user.id, action.user).pipe(
                    map((response) =>
                        UserActions.updateUserSuccess({ user: response.data })
                    ),
                    catchError((error) =>
                        of(
                            UserActions.updateUserFail({
                                error: error.error?.message || 'Failed to update user',
                            })
                        )
                    )
                )
            )
        )
    );

    updateUserRedirect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(UserActions.updateUserSuccess),
                tap(() => {
                    this.router.navigate(['/userlist']);
                })
            ),
        { dispatch: false }
    );

    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.deleteUser),
            exhaustMap((action) =>
                this.userService.deleteUser(action.id).pipe(
                    map(() => UserActions.deleteUserSuccess({ id: action.id })),
                    catchError((error) =>
                        of(
                            UserActions.deleteUserFail({
                                error: error.error?.message || 'Failed to delete user',
                            })
                        )
                    )
                )
            )
        )
    );
}
