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
  state: string;
  operatorId?: number;
  observations?: string;
  typeId?: number;
  typeDescription?: string;
  messageSid: string;
}
