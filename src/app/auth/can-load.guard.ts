import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { AuthState } from './state/auth.state';
import { isAuthenticated } from './state/auth.selector';
import { refreshSuccess, refreshFail, loginSuccess } from './state/auth.action';
import { map, race, switchMap, take } from 'rxjs';

export const canLoadGuard: CanMatchFn = () => {
    const router = inject(Router);
    const store = inject(Store<AuthState>);
    const actions$ = inject(Actions);

    return store.select(isAuthenticated).pipe(
        take(1),
        switchMap((auth) => {
            if (auth) return [true];
            // Wait for refresh to complete (either success or fail)
            return race(
                actions$.pipe(ofType(refreshSuccess, loginSuccess)),
                actions$.pipe(ofType(refreshFail))
            ).pipe(
                take(1),
                map((action) => {
                    if (action.type === refreshFail.type) {
                        return router.createUrlTree(['/login']);
                    }
                    return true;
                })
            );
        })
    );
};
