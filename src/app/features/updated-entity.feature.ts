import { computed } from '@angular/core';
import {
  signalStoreFeature,
  type,
  withComputed,
  withState,
} from '@ngrx/signals';
import { EntityId, EntityState } from '@ngrx/signals/entities';

type UpdatedEntityState = { updatedEntityId: EntityId | null };

export function withUpdatedEntity<Entity>() {
  return signalStoreFeature(
    { state: type<EntityState<Entity>>() },
    withState<UpdatedEntityState>({ updatedEntityId: null }),
    withComputed(({ entityMap, updatedEntityId }) => ({
      updatedEntity: computed(() => {
        const entityId = updatedEntityId();
        return entityId ? entityMap()[entityId] : null;
      }),
    })),
  );
}
