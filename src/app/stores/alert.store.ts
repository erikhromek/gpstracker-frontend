import { computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  patchState,
  signalStore,
  withMethods,
  withComputed,
} from '@ngrx/signals';
import { Alert } from '../models/alert';
import { AlertService } from '../services/alert.service';
import {
  addEntity,
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
import { withCreatedEntity } from '../features/created-entity.feature';
import { withUpdatedEntity } from '../features/updated-entity.feature';
import { WebSocketService } from '../services/websocket.service';

export const AlertsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Alert>(),
  withSelectedEntity(),
  withCreatedEntity(),
  withUpdatedEntity(),
  withRequestStatus(),
  withComputed(({ entities }) => ({
    sortedEntities: computed(() => {
      return entities().toSorted((a, b) =>
        new Date(b.datetime).getTime() > new Date(a.datetime).getTime()
          ? 1
          : -1,
      );
    }),
  })),
  withMethods(
    (
      store,
      alertService = inject(AlertService),
      webSocketService = inject(WebSocketService),
    ) => ({
      async getAlerts(): Promise<void> {
        patchState(store, setPending());

        try {
          const alerts = await firstValueFrom(alertService.getAlerts());

          patchState(store, setAllEntities(alerts), setFulfilled());
        } catch (error) {
          patchState(store, setError(error as HttpErrorResponse));
        }
      },

      async connectToWebSocket(): Promise<void> {
        try {
          webSocketService.connect();
          webSocketService.getMessages().subscribe({
            next: (value) => {
              const newAlert = JSON.parse(value.data) as Alert;
              patchState(store, addEntity(newAlert), {
                createdEntityId: newAlert.id,
              });
            },
          });
        } catch (error) {
          patchState(store, setError(error as HttpErrorResponse));
        }
      },

      disconnectFromWebSocket(): void {
        webSocketService.disconnect();
      },

      setSelectedEntity(id: number | null): void {
        patchState(store, { selectedEntityId: id });
      },

      async createAlertsDummies(): Promise<void> {
        patchState(store, setPending());

        try {
          await firstValueFrom(alertService.createAlertsDummies());

          patchState(store, setFulfilled());
        } catch (error) {
          patchState(store, setError(error as HttpErrorResponse));
        }
      },

      async updateAlert(alert: Alert): Promise<void> {
        patchState(store, setPending());

        try {
          const updatedAlert = await firstValueFrom(
            alertService.updateAlert(alert),
          );

          patchState(
            store,
            updateEntity({
              id: updatedAlert.id,
              changes: updatedAlert,
            }),
            { updatedEntityId: updatedAlert.id },
            setFulfilled(),
          );
        } catch (error) {
          patchState(store, setError(error as HttpErrorResponse));
        }
      },
    }),
  ),
);
