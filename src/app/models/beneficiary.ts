export interface Beneficiary {
  id: number;
  name: string;
  surname: string;
  telephone: string;
  enabled: boolean;
  typeId?: number;
  company?: BeneficiaryCompany;
  description: string;
}

export enum BeneficiaryCompany {
  'OTH' = 'Otra',
  'CLA' = 'Claro',
  'PER' = 'Personal',
  'MOV' = 'Movistar',
  'TUE' = 'Tuenti',
}
