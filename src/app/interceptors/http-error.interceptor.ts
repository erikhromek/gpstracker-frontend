import {
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../stores/auth.store';
import { Router } from '@angular/router';
import { catchError, filter, from, map, switchMap, throwError } from 'rxjs';
import { retryBackoff } from 'backoff-rxjs';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { toObservable } from '@angular/core/rxjs-interop';

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(AuthStore);
  const router = inject(Router);
  const isFulfilled$ = toObservable(store.isFulfilled);
  const error$ = toObservable(store.error);

  return next(request).pipe(
    retryBackoff({
      initialInterval: 100,
      maxRetries: 4,
      shouldRetry: (error) => {
        return error.status !== 401 && error.status !== 400;
      },
    }),
    catchError((error) => {
      if (error.status === 401) {
        if (!store.isLoggedIn()) {
          redirectToLogin(router);
          return throwError(() => error);
        }

        if (!store.isPending()) {
          return from(store.refreshToken()).pipe(
            switchMap(() => {
              const token = store.getAccessToken();
              return next(addHeaders(request, token)).pipe(
                map((response) => bodyToCamelCase(response)),
              );
            }),
          );
        } else {
          if (!request.url.includes('token')) {
            return isFulfilled$.pipe(
              filter((isFulfilled) => isFulfilled !== false),
              switchMap(() => {
                const token = store.getAccessToken();
                return next(addHeaders(request, token)).pipe(
                  map((response) => bodyToCamelCase(response)),
                );
              }),
            );
          } else {
            store.logout();
            redirectToLogin(router);
            return throwError(() => error);
          }
        }
      } else {
        if (error.status !== 400) {
          router.navigate(['/error/' + error.status]);
        }
        return throwError(() => error);
      }
    }),
  );
};

function addHeaders(
  request: HttpRequest<unknown>,
  token: string | null,
): HttpRequest<unknown> {
  return request.clone({
    body: request.body ? snakecaseKeys(request.body as {}) : request.body,
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function bodyToCamelCase(response: HttpEvent<unknown>): HttpEvent<unknown> {
  if (response instanceof HttpResponse && response.body) {
    return response.clone({ body: camelcaseKeys(response.body as {}) });
  } else {
    return response;
  }
}

function redirectToLogin(router: Router): void {
  if (!router.url.includes('/login')) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: router.routerState.snapshot.url },
    });
  }
}
