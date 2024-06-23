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

  public getBeneficiaries(): Observable<Beneficiary[]> {
    return this.httpClient.get<Beneficiary[]>(`${this.apiUrl}/beneficiaries/`);
  }

  public getBeneficiary(id: number): Observable<Beneficiary> {
    return this.httpClient.get<Beneficiary>(
      `${this.apiUrl}/beneficiaries/${id}/`,
    );
  }

  public createBeneficiary(beneficiary: Beneficiary): Observable<Beneficiary> {
    return this.httpClient.post<Beneficiary>(
      `${this.apiUrl}/beneficiaries/`,
      beneficiary,
    );
  }

  public updateBeneficiary(beneficiary: Beneficiary): Observable<Beneficiary> {
    return this.httpClient.patch<Beneficiary>(
      `${this.apiUrl}/beneficiaries/${beneficiary.id}/`,
      beneficiary,
    );
  }

  public toggleBeneficiary(
    id: number,
    enabled: boolean,
  ): Observable<Beneficiary> {
    return this.httpClient.patch<Beneficiary>(
      `${this.apiUrl}/beneficiaries/${id}/`,
      { enabled },
    );
  }
}
