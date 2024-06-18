export interface Alert {
  id: number;
  datetime: Date;
  datetimeAttended?: Date;
  datetimeClosed?: Date;
  beneficiaryId: number;
  beneficiaryName: string;
  beneficiaryDescription: string;
  beneficiaryTypeDescription: string;
  telephone: string;
  latitude: number;
  longitude: number;
  state: AlertState;
  operatorId?: number;
  observations?: string;
  typeId?: number;
  typeDescription?: string;
  messageSid: string;
}

export enum AlertState {
  'N' = 'N',
  'A' = 'A',
  'C' = 'C',
}
