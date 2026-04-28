import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { exhaustMap, take } from 'rxjs';
import { getAuthToken } from '../state/auth.selector';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(getAuthToken).pipe(
    take(1),
    exhaustMap((token) => {
      if (!token) {
        const stored = localStorage.getItem('authToken');
        if (!stored || stored === 'undefined') return next(req);
        token = stored;
      }
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(authReq);
    })
  );
};
