import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private readonly httpClient = inject(HttpClient);

  public getAlerts(): Observable<Alert[]> {
    return this.httpClient.get<Alert[]>(`${this.apiUrl}/alerts/`);
  }

  public getAlertsWithErrors(error: number): Observable<Alert[]> {
    return this.httpClient.get<Alert[]>(
      `${this.apiUrl}/dummy-error/?error=${error}`,
    );
  }

  public updateAlert(alert: Alert): Observable<Alert> {
    return this.httpClient.patch<Alert>(
      `${this.apiUrl}/alerts/${alert.id}/`,
      alert,
    );
  }

  public createAlertsDummies(): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/dummy-alert/`, null);
  }
}
