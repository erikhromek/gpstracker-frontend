import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BeneficiaryType } from '../models/beneficiary-type';

@Injectable({
  providedIn: 'root',
})
export class BeneficiaryTypeService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private readonly httpClient = inject(HttpClient);

  public getBeneficiaryTypes(): Observable<BeneficiaryType[]> {
    return this.httpClient.get<BeneficiaryType[]>(
      `${this.apiUrl}/beneficiary-types/`,
    );
  }

  public getBeneficiaryType(id: number): Observable<BeneficiaryType> {
    return this.httpClient.get<BeneficiaryType>(
      `${this.apiUrl}/beneficiary-types/${id}/`,
    );
  }

  public createBeneficiaryType(
    beneficiaryType: BeneficiaryType,
  ): Observable<BeneficiaryType> {
    return this.httpClient.post<BeneficiaryType>(
      `${this.apiUrl}/beneficiary-types/`,
      beneficiaryType,
    );
  }

  public updateBeneficiaryType(
    beneficiaryType: BeneficiaryType,
  ): Observable<BeneficiaryType> {
    return this.httpClient.patch<BeneficiaryType>(
      `${this.apiUrl}/beneficiary-types/${beneficiaryType.id}/`,
      beneficiaryType,
    );
  }

  public deleteBeneficiaryType(id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.apiUrl}/beneficiary-types/${id}/`,
    );
  }
}
