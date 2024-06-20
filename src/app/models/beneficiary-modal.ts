import { ActionModal } from './action-modal';
import { Beneficiary } from './beneficiary';
import { BeneficiaryType } from './beneficiary-type';

export interface BeneficiaryModal {
  type: ActionModal;
  beneficiary: Beneficiary;
  beneficiaryTypes: BeneficiaryType[];
}
