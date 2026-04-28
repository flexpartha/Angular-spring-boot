import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Authservice } from "../service/authservice";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { catchError, exhaustMap, map, of, tap, switchMap, timer, mapTo } from "rxjs";
import { loginFail, loginStart, loginSuccess, refreshStart, refreshSuccess, refreshFail } from "./auth.action";
import { LoginResponse } from "../models/login.interface";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class AuthEffects {
    private _snackBar = inject(MatSnackBar);
    private actions$ = inject(Actions);
    private authServ = inject(Authservice);
    private store = inject(Store);
    private _router = inject(Router);

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginStart),
            exhaustMap((action) =>
                this.authServ.login(action.username, action.email).pipe(
                    map((response: LoginResponse) =>
                        loginSuccess({ user: { accessToken: response.data.accessToken, refreshToken: response.data.refreshToken }, redirect: true, statusCode: response.status })
                    ),
                    catchError((error) => {
                        console.log('Login error:', error.error.message, 'Status code:', error.status);
                        return of(loginFail({ error: error.error.message, statusCode: error.status }))
                    })
                )
            )
        )
    );

    // Effect to store auth tokens in localStorage for persistence across refreshes
    loginStoreToken$ = createEffect(() => this.actions$.pipe(
        ofType(loginSuccess),
        tap((action) => {
            console.log(action.user.accessToken);
            // Save token securely; in a real app consider HttpOnly cookies or secure storage
            localStorage.setItem('authToken', action.user.accessToken);
            if (action.user.refreshToken) {
                localStorage.setItem('refreshToken', action.user.refreshToken);
            }
        })
    ), { dispatch: false });

    // Effect to navigate to userlist after successful login
    loginredirect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loginSuccess),
            tap((action) => {
                if (action.redirect) {
                    this._router.navigate(['/userlist']);
                }
            })
        );
    }, { dispatch: false })

    // Effect to start silent refresh timer after login or after a successful refresh
    startRefreshTimer$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loginSuccess, refreshSuccess),
            // Wait 1 minute then dispatch refresh start
            switchMap(() => timer(60000).pipe(mapTo(refreshStart())))
        );
    });

    // Effect to perform token refresh
    refreshToken$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(refreshStart),
            switchMap(() => {
                const refresh = localStorage.getItem('refreshToken');
                if (!refresh) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('refreshToken');
                    this._router.navigate(['/login']);
                    this._snackBar.open('Invalid or expired refresh token', 'Close', { duration: 3000 });
                    return of(refreshFail({ error: 'Invalid or expired refresh token' }));
                }
                return this.authServ.refreshToken(refresh).pipe(
                    map((resp: any) => {
                        const newAccess = resp.data?.accessToken;
                        const newRefresh = resp.data?.refreshToken;
                        if (!newAccess) {
                            throw { error: { message: 'Refresh failed' } };
                        }
                        localStorage.setItem('authToken', newAccess);
                        if (newRefresh) {
                            localStorage.setItem('refreshToken', newRefresh);
                        }
                        // Show snackbar about silent refresh
                        this._snackBar.open('Token refreshed silently after one minute', 'Close', { duration: 3000 });
                        return refreshSuccess({ accessToken: newAccess, refreshToken: newRefresh });
                    }),
                    catchError((err) => {
                        // On failure, clear tokens and redirect to login
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('refreshToken');
                        this._router.navigate(['/login']);
                        this._snackBar.open(err?.error?.message, 'Close', { duration: 3000 });
                        return of(refreshFail({ error: err?.error?.message || 'Refresh failed' }));
                    })
                );
            })
        );
    });

}