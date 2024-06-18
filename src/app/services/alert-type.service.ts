import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertType } from '../models/alert-type';

@Injectable({
  providedIn: 'root',
})
export class AlertTypeService {
  apiUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) {}

  getAlertTypes(): Observable<AlertType[]> {
    return this.httpClient.get<AlertType[]>(`${this.apiUrl}/alert-types/`);
  }

  getAlertType(id: number): Observable<AlertType> {
    return this.httpClient.get<AlertType>(`${this.apiUrl}/alert-types/${id}/`);
  }

  createAlertType(alertType: AlertType): Observable<AlertType> {
    return this.httpClient.post<AlertType>(
      `${this.apiUrl}/alert-types/`,
      alertType
    );
  }

  updateAlertType(alertType: AlertType): Observable<AlertType> {
    return this.httpClient.patch<AlertType>(
      `${this.apiUrl}/alert-types/${alertType.id}/`,
      alertType
    );
  }

  deleteAlertType(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/alert-types/${id}/`);
  }
}
