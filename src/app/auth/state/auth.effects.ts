import { inject, Injectable, signal } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Authservice } from "../service/authservice";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { catchError, exhaustMap, map, of, tap, switchMap, timer, takeUntil } from "rxjs";
import { Subject } from "rxjs";
import { loginFail, loginStart, loginSuccess, logout, sessionExpired, refreshStart, refreshSuccess, refreshFail, googleLoginStart, googleLoginSuccess, googleLoginFail } from "./auth.action";
import { LoginResponse } from "../models/login.interface";
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from "../models/user.interface";

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authServ = inject(Authservice);
    private store = inject(Store);
    private _router = inject(Router);
    private _snackBar = inject(MatSnackBar);

    private cancelTimer$ = new Subject<void>();

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginStart),
            exhaustMap((action) =>
                this.authServ.login(action.username, action.email).pipe(
                    map((response: LoginResponse) => {
                        console.log('Login response:', response);
                        sessionStorage.setItem('userName', response.data.userName);
                        return loginSuccess({
                            user: { accessToken: response.data.accessToken },
                            redirect: true,
                            statusCode: response.status
                        });
                    }),
                    catchError((error) =>
                        of(loginFail({ error: error.error?.message, statusCode: error.status }))
                    )
                )
            )
        )
    );

    // Save to sessionStorage and navigate after login
    loginSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginSuccess, googleLoginSuccess),
            tap((action) => {
                this.handlePostLogin(action);
                sessionStorage.removeItem('PKCE_verifier');
                sessionStorage.removeItem('codeVerifier');
                // sessionStorage.setItem('loggedIn', 'true');
                // if (action.user.refreshToken) {
                //     sessionStorage.setItem('refreshToken', action.user.refreshToken);
                // }
                // if (action.redirect) {
                //     this._router.navigate(['/userlist']);
                // }
            })
        ), { dispatch: false });

    googleLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(googleLoginStart),
            exhaustMap((action) =>
                this.authServ.googleLogin(action.code).pipe(
                    map((response: LoginResponse) => {
                        console.log('google-Login response:', response);
                        sessionStorage.setItem('userName', response.data.userName);
                        return googleLoginSuccess({
                            user: { accessToken: response.data.accessToken },
                            redirect: true,
                            statusCode: response.status
                        });
                    }),
                    catchError((error) =>
                        of(googleLoginFail({ error: error.error?.message, statusCode: error.status }))
                    )
                )
            )
        )
    );

    googleLoginFail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(googleLoginFail),
            tap(({ error }) => {
                this._snackBar.open(`Google login failed: ${error}`, 'Close', {
                    duration: 5000,
                    panelClass: ['snack-error'],
                });
                this._router.navigate(['/login']);
            })
        ),
        { dispatch: false }
    );
    // Start 1 min timer after login — dispatches refreshStart({ silent: false })
    startTimerAfterLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginSuccess, googleLoginSuccess),
            switchMap(() =>
                timer(60000).pipe(
                    takeUntil(this.cancelTimer$),
                    map(() => refreshStart({ silent: false }))
                )
            )
        )
    );

    // Restart 1 min timer after each successful timer-based refresh OR page reload restore
    restartTimerAfterRefresh$ = createEffect(() =>
        this.actions$.pipe(
            ofType(refreshSuccess),
            switchMap(() =>
                timer(60000).pipe(
                    takeUntil(this.cancelTimer$),
                    map(() => refreshStart({ silent: false }))
                )
            )
        )
    );

    // Perform token refresh
    refreshToken$ = createEffect(() =>
        this.actions$.pipe(
            ofType(refreshStart),
            switchMap((action) =>
                this.authServ.refreshToken(action.silent).pipe(
                    map((resp: LoginResponse) => {
                        console.log('Refresh response:', resp);
                        const newAccess = resp.data?.accessToken;
                        //const newRefresh = resp.data?.refreshToken;
                        if (!newAccess) throw new Error('Refresh failed');
                        //if (newRefresh) sessionStorage.setItem('refreshToken', newRefresh);
                        if (!action.silent) {
                            this._snackBar.open('Session restored', 'Close', { duration: 3000, panelClass: ['snack-success'] });
                        }
                        return refreshSuccess({ accessToken: newAccess });
                    }),
                    catchError((err: { error?: { message?: string } }) => {
                        if (!action.silent) {
                            this.cancelTimer$.next();
                            sessionStorage.removeItem('loggedIn');
                            sessionStorage.removeItem('refreshToken');
                            this._router.navigate(['/login']);
                            return of(sessionExpired());
                        }
                        return of(refreshFail({ error: err?.error?.message ?? 'Refresh failed' }));
                    })
                )
            )
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logout),
            tap(() => this.cancelTimer$.next()),
            switchMap(() =>
                this.authServ.logout().pipe(
                    tap((resp: LoginResponse) => {
                        sessionStorage.removeItem('loggedIn');
                        sessionStorage.removeItem('refreshToken');
                        this._snackBar.open(resp.message, 'Close', { duration: 3000, panelClass: ['snack-success'] });
                        this._router.navigate(['/login']);
                    }),
                    catchError(() => {
                        sessionStorage.removeItem('loggedIn');
                        sessionStorage.removeItem('refreshToken');
                        this._router.navigate(['/login']);
                        return of(null);
                    })
                )
            )
        ), { dispatch: false }
    )


    private handlePostLogin(action: { user: User; redirect: boolean }) {
        sessionStorage.setItem('loggedIn', 'true');
        // if (action.user.refreshToken) {
        //     sessionStorage.setItem('refreshToken', action.user.refreshToken);
        // }
        if (action.redirect) {
            this._router.navigate(['/userlist']);
        }
    }
}
