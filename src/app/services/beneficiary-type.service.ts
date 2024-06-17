import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BeneficiaryType } from '../models/beneficiary-type';

@Injectable({
    providedIn: 'root',
  })
  export class BeneficiaryTypeService {
    apiUrl = `${environment.apiUrl}`;
  
    constructor(private httpClient: HttpClient) {}
  
    getBeneficiaryTypes(): Observable<BeneficiaryType[]> {
        return this.httpClient.get<BeneficiaryType[]>(`${this.apiUrl}/beneficiary-types/`);
    }

    getBeneficiaryType(id: number): Observable<BeneficiaryType> {
      return this.httpClient.get<BeneficiaryType>(`${this.apiUrl}/beneficiary-types/${id}/`);
  }

    createBeneficiaryType(beneficiaryType: BeneficiaryType): Observable<BeneficiaryType> {
        return this.httpClient.post<BeneficiaryType>(`${this.apiUrl}/beneficiary-types/`, beneficiaryType);
    }
  
    updateBeneficiaryType(beneficiaryType: BeneficiaryType): Observable<BeneficiaryType> {
      return this.httpClient.patch<BeneficiaryType>(`${this.apiUrl}/beneficiary-types/${beneficiaryType.id}/`, beneficiaryType);
    }

    deleteBeneficiaryType(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiUrl}/beneficiary-types/${id}/`);
      }

  }