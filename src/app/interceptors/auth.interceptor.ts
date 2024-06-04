import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  let isRefreshing = false;
  const router = inject(Router);
  const authService = inject(AuthService);
  // const accessToken = authService.getAccessToken();
  const requestCloned = request.clone({
    headers: request.headers.set('Authorization', 'Bearer ' + authService.getAccessToken()),
  });

  return next(requestCloned).pipe(
    catchError((error) => {
      if (error.status == 401) {
        if (!isRefreshing) {
          isRefreshing = true;

          if (authService.isLoggedIn()) {
            return authService.refreshToken().pipe(
              switchMap(() => {
                isRefreshing = false;
                return next(request.clone({
                  headers: request.headers.set('Authorization', 'Bearer ' + authService.getAccessToken()),
                }));
              }),
              catchError((error) => {
                isRefreshing = false;
                authService.logout();
                router.navigate(['/login'], {
                  queryParams: { returnUrl: router.routerState.snapshot.url },
                });

                return throwError(() => error);
              })
            );
          }
        }

        return next(request.clone({
          headers: request.headers.set('Authorization', 'Bearer ' + authService.getAccessToken()),
        }));
      }

      return throwError(() => error);
    })
  );
};
