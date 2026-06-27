import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { exhaustMap, take } from 'rxjs';
import { getAuthToken } from '../state/auth.selector';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('https://accounts.google.com') || req.url.startsWith('https://oauth2.googleapis.com')) {
    return next(req);
  }

  const store = inject(Store);

  return store.select(getAuthToken).pipe(
    take(1),
    exhaustMap((token) => {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(authReq);
    })
  );
};
