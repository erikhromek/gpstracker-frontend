import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { patchState, signalStore, withMethods, withHooks } from '@ngrx/signals';
import { BeneficiaryType } from '../models/beneficiary-type';
import { BeneficiaryTypeService } from '../services/beneficiary-type.service';
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

export const BeneficiaryTypesStore = signalStore(
  { providedIn: 'root' },
  withEntities<BeneficiaryType>(),
  withSelectedEntity(),
  withRequestStatus(),
  withMethods(
    (store, beneficiaryTypeService = inject(BeneficiaryTypeService)) => ({
      async getBeneficiaryTypes() {
        patchState(store, setPending());

        try {
          const beneficiaryTypes = await firstValueFrom(
            beneficiaryTypeService.getBeneficiaryTypes(),
          );

          patchState(store, setAllEntities(beneficiaryTypes), setFulfilled());
        } catch (error) {
          patchState(store, setError(error as HttpErrorResponse));
        }
      },

      setBeneficiaryType(id: number): void {
        patchState(store, { selectedEntityId: id });
      },

      async createBeneficiaryType(
        beneficiaryType: BeneficiaryType,
      ): Promise<void> {
        patchState(store, setPending());

        try {
          const createdBeneficiaryType = await firstValueFrom(
            beneficiaryTypeService.createBeneficiaryType(beneficiaryType),
          );

          patchState(store, addEntity(createdBeneficiaryType), setFulfilled());
        } catch (error) {
          patchState(store, setError(error as HttpErrorResponse));
        }
      },

      async updateBeneficiaryType(
        beneficiaryType: BeneficiaryType,
      ): Promise<void> {
        patchState(store, setPending());

        try {
          const updatedBeneficiaryType = await firstValueFrom(
            beneficiaryTypeService.updateBeneficiaryType(beneficiaryType),
          );

          patchState(
            store,
            updateEntity({
              id: updatedBeneficiaryType.id,
              changes: updatedBeneficiaryType,
            }),
            setFulfilled(),
          );
        } catch (error) {
          patchState(store, setError(error as HttpErrorResponse));
        }
      },

      async deleteBeneficiaryType(id: number): Promise<void> {
        patchState(store, setPending());

        try {
          await firstValueFrom(
            beneficiaryTypeService.deleteBeneficiaryType(id),
          );

          patchState(store, removeEntity(id), setFulfilled());
        } catch (error) {
          patchState(store, setError(error as HttpErrorResponse));
        }
      },
    }),
  ),
  withHooks({ onInit: async (store) => await store.getBeneficiaryTypes() }),
);
