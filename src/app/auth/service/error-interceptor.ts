import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Bad Request: Invalid data submitted.',
  401: 'Unauthorized: Please log in again.',
  403: 'Forbidden: You do not have permission.',
  404: 'Not Found: The requested resource does not exist.',
  408: 'Request Timeout: The server timed out.',
  409: 'Conflict: A conflict occurred with the current state.',
  422: 'Unprocessable Entity: Validation failed.',
  429: 'Too Many Requests: Please slow down.',
  500: 'Internal Server Error: Something went wrong on the server.',
  502: 'Bad Gateway: Invalid response from upstream server.',
  503: 'Service Unavailable: The server is temporarily unavailable.',
  504: 'Gateway Timeout: The server took too long to respond.Please try again later.',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        ERROR_MESSAGES[error.status] ||
        (typeof error.error?.message === 'string' ? error.error.message : null) ||
        'An unexpected error occurred.';
      snackBar.open(message, 'Close', { duration: 3000 });
      return throwError(() => error);
    })
  );
};
