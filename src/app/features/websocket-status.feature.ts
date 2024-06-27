import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export type WebSocketStatus = 'connected' | 'disconnected';

export type WebSocketStatusState = { webSocketStatus: WebSocketStatus };

export function withWebSocketStatus() {
  return signalStoreFeature(
    withState<WebSocketStatusState>({ webSocketStatus: 'disconnected' }),
    withComputed(({ webSocketStatus }) => ({
      isConnected: computed(() => webSocketStatus() === 'connected'),
      isDisconnected: computed(() => webSocketStatus() === 'disconnected'),
    })),
  );
}

export function setConnected(): WebSocketStatusState {
  return { webSocketStatus: 'connected' };
}

export function setDisconnected(): WebSocketStatusState {
  return { webSocketStatus: 'disconnected' };
}
