import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { patchState, signalStore, withMethods, withHooks } from '@ngrx/signals';
import { Beneficiary } from '../models/beneficiary';
import { BeneficiaryService } from '../services/beneficiary.service';
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

export const BeneficiariesStore = signalStore(
  { providedIn: 'root' },
  withEntities<Beneficiary>(),
  withSelectedEntity(),
  withRequestStatus(),
  withMethods((store, beneficiaryService = inject(BeneficiaryService)) => ({
    async getBeneficiaries(): Promise<void> {
      patchState(store, setPending());

      try {
        const beneficiaries = await firstValueFrom(
          beneficiaryService.getBeneficiaries(),
        );
        patchState(store, setAllEntities(beneficiaries), setFulfilled());
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },

    setBeneficiary(id: number | null): void {
      patchState(store, { selectedEntityId: id });
    },

    async createBeneficiary(beneficiary: Beneficiary): Promise<void> {
      patchState(store, setPending());

      try {
        const createdBeneficiary = await firstValueFrom(
          beneficiaryService.createBeneficiary(beneficiary),
        );

        patchState(store, addEntity(createdBeneficiary), setFulfilled());
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },

    async updateBeneficiary(beneficiary: Beneficiary): Promise<void> {
      patchState(store, setPending());

      try {
        const updatedBeneficiary = await firstValueFrom(
          beneficiaryService.updateBeneficiary(beneficiary),
        );

        patchState(
          store,
          updateEntity({
            id: updatedBeneficiary.id,
            changes: updatedBeneficiary,
          }),
          setFulfilled(),
        );
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },

    async toggleBeneficiary(id: number): Promise<void> {
      patchState(store, setPending());

      try {
        const beneficiary = store.selectedEntity() as Beneficiary;

        const updatedBeneficiary = await firstValueFrom(
          beneficiaryService.toggleBeneficiary(
            beneficiary.id,
            !beneficiary.enabled,
          ),
        );

        patchState(
          store,
          updateEntity({
            id: updatedBeneficiary.id,
            changes: updatedBeneficiary,
          }),
          setFulfilled(),
        );
      } catch (error) {
        patchState(store, setError(error as HttpErrorResponse));
      }
    },
  })),
  withHooks({ onInit: async (store) => await store.getBeneficiaries() }),
);
