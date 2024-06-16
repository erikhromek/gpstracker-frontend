import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  apiUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) {}

  getAlerts(): Observable<Alert[]> {
    return this.httpClient.get<Alert[]>(`${this.apiUrl}/alerts/`);
  }

  updateAlert(alert: Alert): Observable<Alert> {
    return this.httpClient.patch<Alert>(
      `${this.apiUrl}/alerts/${alert.id}/`,
      alert
    );
  }
}
