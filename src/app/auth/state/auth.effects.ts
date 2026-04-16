import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Authservice } from "../service/authservice";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { loginFail, loginStart, loginSuccess } from "./auth.action";
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
                        loginSuccess({ user: { token: response.data.token }, redirect: true, statusCode: response.status })
                    ),
                    catchError((error) => {
                        console.log('Login error:', error.error.message, 'Status code:', error.status);
                        return of(loginFail({ error: error.error.message, statusCode: error.status }))
                    })
                )
            )
        )
    );

    // Effect to store auth token in localStorage for persistence across refreshes
    loginStoreToken$ = createEffect(() => this.actions$.pipe(
        ofType(loginSuccess),
        tap((action) => {
            // Save token securely; in a real app consider HttpOnly cookies or secure storage
            localStorage.setItem('authToken', action.user.token);
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

}