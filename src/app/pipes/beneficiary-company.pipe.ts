import { Pipe, PipeTransform } from '@angular/core';
import { BeneficiaryCompany } from '../models/beneficiary';

@Pipe({
  name: 'beneficiaryCompany',
  standalone: true,
})
export class BeneficiaryCompanyPipe implements PipeTransform {
  transform(beneficiaryCompany: string): string {
    return BeneficiaryCompany[
      beneficiaryCompany as keyof typeof BeneficiaryCompany
    ];
  }
}
