import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from './state/auth.state';
import { isAuthenticated } from './state/auth.selector';
import { map } from 'rxjs';

export const canLoadGuard: CanMatchFn = () => {
    const router = inject(Router);
    return inject(Store<AuthState>).select(isAuthenticated).pipe(
        map(auth => auth || router.createUrlTree(['/login']))
    );
};
