import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { patchState, signalStore, withMethods, withHooks } from '@ngrx/signals';
import { AlertType } from '../models/alert-type';
import { AlertTypeService } from '../services/alert-type.service';
import {
  addEntity,
  removeEntity,
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

export const AlertTypesStore = signalStore(
  { providedIn: 'root' },
  withEntities<AlertType>(),
  withSelectedEntity(),
  withRequestStatus(),
  withMethods((store, alertTypeService = inject(AlertTypeService)) => ({
    async getAlertTypes(): Promise<void> {
      patchState(store, setPending());

      try {
        const alertTypes = await firstValueFrom(
          alertTypeService.getAlertTypes(),
        );

        patchState(store, setAllEntities(alertTypes), setFulfilled());
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },

    setAlertType(id: number | null): void {
      patchState(store, { selectedEntityId: id });
    },

    async createAlertType(alertType: AlertType): Promise<void> {
      patchState(store, setPending());

      try {
        const createdAlertType = await firstValueFrom(
          alertTypeService.createAlertType(alertType),
        );

        patchState(store, addEntity(createdAlertType), setFulfilled());
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },

    async updateAlertType(alertType: AlertType): Promise<void> {
      patchState(store, setPending());

      try {
        const updatedAlertType = await firstValueFrom(
          alertTypeService.updateAlertType(alertType),
        );

        patchState(
          store,
          updateEntity({
            id: updatedAlertType.id,
            changes: updatedAlertType,
          }),
          setFulfilled(),
        );
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },

    async deleteAlertType(id: number): Promise<void> {
      patchState(store, setPending());

      try {
        await firstValueFrom(alertTypeService.deleteAlertType(id));

        patchState(store, removeEntity(id), setFulfilled());
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },
  })),
  withHooks({ onInit: async (store) => await store.getAlertTypes() }),
);
