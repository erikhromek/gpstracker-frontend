import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../stores/auth.store';

export const authGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const store = inject(AuthStore);
  const isLoggedIn = store.isLoggedIn();
  return isLoggedIn
    ? true
    : router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
};
