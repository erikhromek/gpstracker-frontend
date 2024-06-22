import { computed } from '@angular/core';
import {
  signalStoreFeature,
  type,
  withComputed,
  withState,
} from '@ngrx/signals';
import { EntityId, EntityState } from '@ngrx/signals/entities';

type CreatedEntityState = { createdEntityId: EntityId | null };

export function withCreatedEntity<Entity>() {
  return signalStoreFeature(
    { state: type<EntityState<Entity>>() },
    withState<CreatedEntityState>({ createdEntityId: null }),
    withComputed(({ entityMap, createdEntityId }) => ({
      createdEntity: computed(() => {
        const entityId = createdEntityId();
        return entityId ? entityMap()[entityId] : null;
      }),
    })),
  );
}
