import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, firstValueFrom, switchMap, timer } from 'rxjs';
import { AuthWebSocket } from '../models/auth-websocket';
import { UsersStore } from '../stores/user.store';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private readonly httpClient = inject(HttpClient);
  private readonly store = inject(UsersStore);
  private organizationId: number | undefined;
  private uuid!: string;
  private webSocket!: WebSocket;
  private messages$!: Subject<MessageEvent>;
  private connectionStatus$!: Subject<boolean>;
  private reconnectionAttempts = 0;
  private manualDisconnection = false;

  constructor() {
    this.messages$ = new Subject<MessageEvent>();
    this.connectionStatus$ = new Subject<boolean>();
  }

  private auth(): Observable<AuthWebSocket> {
    return this.httpClient.get<AuthWebSocket>(`${this.apiUrl}/ws/auth/`);
  }

  private async getOrganizationId(): Promise<void> {
    await this.store.getProfile();
    this.organizationId = this.store.selectedEntity()?.organizationId;
  }

  public async connect(): Promise<void> {
    this.organizationId = this.store.selectedEntity()?.organizationId;

    if (!this.organizationId) {
      await this.getOrganizationId();
    }

    if (!this.reconnectionAttempts || this.reconnectionAttempts % 3 === 0) {
      this.uuid = (await firstValueFrom(this.auth())).uuid;
    }

    const webSocketUrl = `${environment.apiUrl}/ws/alerts/organization-${this.organizationId}/?uuid=${this.uuid}`;

    this.webSocket = new WebSocket(webSocketUrl);

    this.webSocket.onopen = () => {
      this.connectionStatus$.next(true);
      this.reconnectionAttempts = 0;
    };

    this.webSocket.onmessage = (message) => {
      this.messages$.next(message);
    };

    this.webSocket.onerror = (error) => {
      this.webSocket.close();
    };

    this.webSocket.onclose = () => {
      this.connectionStatus$.next(false);
      if (!this.manualDisconnection) {
        this.reconnect();
      }
    };
  }

  public disconnect(): void {
    this.manualDisconnection = true;

    if (this.webSocket) {
      this.webSocket.close();
    }
  }

  private reconnect(): void {
    const backoffTime = Math.min(
      1000 * Math.pow(2, this.reconnectionAttempts),
      30000,
    );

    timer(backoffTime)
      .pipe(
        switchMap(() => {
          return new Observable((observer) => {
            this.connect();
            observer.next();
            observer.complete();
          });
        }),
      )
      .subscribe(() => {
        this.reconnectionAttempts++;
      });
  }

  public getMessages(): Observable<MessageEvent> {
    return this.messages$.asObservable();
  }

  public getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  public sendMessage(message: string): void {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(message);
    } else {
      console.error('Cannot send message. WebSocket is not open.');
    }
  }
}
