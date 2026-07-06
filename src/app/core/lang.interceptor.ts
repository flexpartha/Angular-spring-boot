import { HttpInterceptorFn } from '@angular/common/http';

export const langInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/assets/i18n/')) {
    return next(req);
  }
  const lang = localStorage.getItem('lang') ?? 'en';
  const cloned = req.clone({ setHeaders: { 'Accept-Language': lang } });
  return next(cloned);
};
