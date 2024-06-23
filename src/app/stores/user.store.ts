import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { patchState, signalStore, withMethods, withHooks } from '@ngrx/signals';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import {
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { HttpErrorResponse } from '@angular/common/http';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '../features/request-status.feature';
import { withSelectedEntity } from '../features/selected-entity.feature';

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withEntities<User>(),
  withSelectedEntity(),
  withRequestStatus(),
  withMethods((store, userService = inject(UserService)) => ({
    async getProfile(): Promise<void> {
      patchState(store, setPending());

      try {
        const profile = await firstValueFrom(userService.getProfile());

        patchState(store, setAllEntities([profile]), setFulfilled());
        patchState(store, { selectedEntityId: profile.id });
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },

    async updateProfile(profile: User): Promise<void> {
      patchState(store, setPending());

      try {
        const updatedProfile = await firstValueFrom(
          userService.updateProfile(profile),
        );

        patchState(
          store,
          updateEntity({
            id: updatedProfile.id,
            changes: updatedProfile,
          }),
          setFulfilled(),
        );
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },
  })),
  withHooks({
    onInit: async (store) => {
      await store.getProfile();
    },
  }),
);
