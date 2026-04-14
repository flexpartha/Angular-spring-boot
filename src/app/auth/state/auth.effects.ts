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

    loginredirect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loginSuccess),
            tap((action) => {
                this._router.navigate(['/userlist']);
            })
        );
    }, { dispatch: false })

}