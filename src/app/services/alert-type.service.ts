import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertType } from '../models/alert-type';

@Injectable({
  providedIn: 'root',
})
export class AlertTypeService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private httpClient = inject(HttpClient);

  public getAlertTypes(): Observable<AlertType[]> {
    return this.httpClient.get<AlertType[]>(`${this.apiUrl}/alert-types/`);
  }

  public getAlertType(id: number): Observable<AlertType> {
    return this.httpClient.get<AlertType>(`${this.apiUrl}/alert-types/${id}/`);
  }

  public createAlertType(alertType: AlertType): Observable<AlertType> {
    return this.httpClient.post<AlertType>(
      `${this.apiUrl}/alert-types/`,
      alertType,
    );
  }

  public updateAlertType(alertType: AlertType): Observable<AlertType> {
    return this.httpClient.patch<AlertType>(
      `${this.apiUrl}/alert-types/${alertType.id}/`,
      alertType,
    );
  }

  public deleteAlertType(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/alert-types/${id}/`);
  }
}
