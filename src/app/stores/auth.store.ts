import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { patchState, signalStore, withMethods, withHooks } from '@ngrx/signals';
import { AuthToken } from '../models/auth-token';
import { AuthUser } from '../models/auth-user';
import { AuthService } from '../services/auth.service';
import {
  addEntity,
  removeAllEntities,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { HttpErrorResponse } from '@angular/common/http';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '../features/request-status.feature';
import { RegisterUser } from '../models/register-user';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withEntities<AuthToken>(),
  withRequestStatus(),
  withMethods((store, authService = inject(AuthService)) => ({
    getAuthToken(): void {
      patchState(store, setPending());

      try {
        const accessToken = localStorage.getItem('access');
        const refreshToken = localStorage.getItem('refresh');

        if (accessToken && refreshToken) {
          const authToken = {
            access: accessToken,
            refresh: refreshToken,
          };

          patchState(
            store,
            setAllEntities([authToken], { idKey: 'access' }),
            setFulfilled(),
          );
        }
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },

    async login(user: AuthUser): Promise<void> {
      patchState(store, setPending());

      try {
        const authToken = await firstValueFrom(authService.login(user));

        localStorage.setItem('access', authToken.access);
        localStorage.setItem('refresh', authToken.refresh);

        patchState(
          store,
          setAllEntities([authToken], { idKey: 'access' }),
          setFulfilled(),
        );
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },

    async register(user: RegisterUser): Promise<void> {
      patchState(store, setPending());

      try {
        await firstValueFrom(authService.register(user));

        patchState(store, setFulfilled());
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },

    async refreshToken(): Promise<void> {
      patchState(store, setPending());

      try {
        const authToken = await firstValueFrom(authService.refreshToken());

        localStorage.setItem('access', authToken.access);
        localStorage.setItem('refresh', authToken.refresh);

        patchState(
          store,
          setAllEntities([authToken], { idKey: 'access' }),
          setFulfilled(),
        );
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },

    getAccessToken(): string | null {
      try {
        return store.entities()[0]?.access;
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
        return null;
      }
    },

    getRefreshToken(): string | null {
      try {
        return store.entities()[0]?.refresh;
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
        return null;
      }
    },

    isLoggedIn(): boolean {
      try {
        return store.entities()[0]?.access ? true : false;
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
        return false;
      }
    },

    logout(): void {
      try {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        patchState(store, removeAllEntities());
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },
  })),
  withHooks({
    onInit: (store) => {
      store.getAuthToken();
    },
  }),
);
