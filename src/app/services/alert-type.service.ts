import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
}
