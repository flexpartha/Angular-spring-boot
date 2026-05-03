import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Authservice } from "../service/authservice";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { catchError, exhaustMap, map, of, tap, switchMap, timer, mapTo } from "rxjs";
import { loginFail, loginStart, loginSuccess, refreshStart, refreshSuccess, refreshFail } from "./auth.action";
import { LoginResponse } from "../models/login.interface";

@Injectable()
export class AuthEffects {
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
                        const message = error.error?.message || 'An unexpected error occurred.';
                        return of(loginFail({ error: message, statusCode: error.status }))
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
                        return refreshSuccess({ accessToken: newAccess, refreshToken: newRefresh });
                    }),
                    catchError((err) => {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('refreshToken');
                        this._router.navigate(['/login']);
                        return of(refreshFail({ error: err?.error?.message || 'Refresh failed' }));
                    })
                );
            })
        );
    });

}