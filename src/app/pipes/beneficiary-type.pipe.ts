import { Pipe, PipeTransform } from '@angular/core';
import { BeneficiaryType } from '../models/beneficiary-type';

@Pipe({
  name: 'beneficiaryType',
  standalone: true,
})
export class BeneficiaryTypePipe implements PipeTransform {
  transform(
    beneficiaryTypeId: number,
    beneficiaryTypes: BeneficiaryType[],
  ): string {
    const beneficiaryType = beneficiaryTypes.find(
      (beneficiaryType) => beneficiaryType.id === beneficiaryTypeId,
    );
    return beneficiaryType ? beneficiaryType.description : '';
  }
}
