import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from './state/auth.state';
import { isAuthenticated } from './state/auth.selector';
import { map } from 'rxjs';

export const canLoadGuard: CanMatchFn = () => {
    const router = inject(Router);
    const store = inject(Store<AuthState>);
    // Allow navigation if authenticated in store or if a token exists in localStorage
    return store.select(isAuthenticated).pipe(
        map(auth => {
            if (auth) {
                return true;
            }
            const token = localStorage.getItem('authToken');
            return token ? true : router.createUrlTree(['/login']);
        })
    );
};
