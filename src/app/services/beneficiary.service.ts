import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beneficiary } from '../models/beneficiary';

@Injectable({
  providedIn: 'root',
})
export class BeneficiaryService {
  apiUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) {}

  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.httpClient.get<Beneficiary[]>(`${this.apiUrl}/beneficiaries/`);
  }

  getBeneficiary(id: number): Observable<Beneficiary> {
    return this.httpClient.get<Beneficiary>(
      `${this.apiUrl}/beneficiaries/${id}/`,
    );
  }

  createBeneficiary(beneficiary: Beneficiary): Observable<Beneficiary> {
    return this.httpClient.post<Beneficiary>(
      `${this.apiUrl}/beneficiaries/`,
      beneficiary,
    );
  }

  updateBeneficiary(beneficiary: Beneficiary): Observable<Beneficiary> {
    return this.httpClient.patch<Beneficiary>(
      `${this.apiUrl}/beneficiaries/${beneficiary.id}/`,
      beneficiary,
    );
  }

  disableBeneficiary(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/beneficiaries/${id}/`);
  }

  enableBeneficiary(id: number): Observable<Beneficiary> {
    return this.httpClient.patch<Beneficiary>(
      `${this.apiUrl}/beneficiaries/${id}/`,
      { enabled: true },
    );
  }
}
