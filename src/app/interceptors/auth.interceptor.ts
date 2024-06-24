import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { AuthStore } from '../stores/auth.store';
import { inject } from '@angular/core';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';
import { map } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(AuthStore);
  const token = store.getAccessToken();

  return next(
    request.clone({
      body: request.body ? snakecaseKeys(request.body as {}) : request.body,
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  ).pipe(
    map((response) => {
      if (response instanceof HttpResponse && response.body) {
        return response.clone({ body: camelcaseKeys(response.body as {}) });
      } else {
        return response;
      }
    }),
  );
};
